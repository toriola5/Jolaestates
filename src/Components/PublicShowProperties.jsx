import { useState, useEffect } from "react";
import { supabase } from "../Utils/Supabase";
import styles from "./PublicShowProperties.module.css";
import Loading from "./Loading.jsx";
import { NavLink } from "react-router-dom";

//TODO: Improve UI/UX design
//TODO: Add more filter options (price range, bedrooms, bathrooms, etc.)
//TODO: Add sorting options (price low to high, newest listings, etc.)

function PublicShowProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const itemsPerPage = 6;
  const [filter, setFilter] = useState({
    listingType: "all",
    propertyType: "all",
    state: "all",
  });

  useEffect(() => {
    fetchProperties();
  }, [filter, currentPage]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Build base query for counting
      let countQuery = supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Apply filters to count query
      if (filter.listingType !== "all") {
        countQuery = countQuery.eq("listing_type", filter.listingType);
      }
      if (filter.propertyType !== "all") {
        countQuery = countQuery.eq("property_type", filter.propertyType);
      }
      if (filter.state !== "all") {
        countQuery = countQuery.eq("state", filter.state);
      }

      // Get total count
      const { count } = await countQuery;
      setTotalProperties(count || 0);

      // Build data query with pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(from, to);

      // Apply filters
      if (filter.listingType !== "all") {
        query = query.eq("listing_type", filter.listingType);
      }
      if (filter.propertyType !== "all") {
        query = query.eq("property_type", filter.propertyType);
      }
      if (filter.state !== "all") {
        query = query.eq("state", filter.state);
      }

      const { data, error } = await query;

      if (error) throw error;

      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const handleFilterChange = (filterType, value) => {
    setFilter({ ...filter, [filterType]: value });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const totalPages = Math.ceil(totalProperties / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  //   if (loading) {
  //     return (
  //       //   <div className={styles.container}>
  //       //     <div className={styles.loading}>
  //       //       <div className={styles.spinner}></div>
  //       //       <p>Loading properties...</p>
  //       //     </div>
  //       //   </div>
  //       <Loading message="Loading properties..." />
  //     );
  //   }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error loading properties: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavLink to="/" className={styles.homeLink}>
        &larr; Back to Home
      </NavLink>
      <div className={styles.header}>
        <h2 className={styles.title}>Available Properties</h2>
        <p className={styles.subtitle}>
          Browse through our exclusive collection of properties
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Listing Type:</label>
          <select
            value={filter.listingType}
            onChange={(e) => handleFilterChange("listingType", e.target.value)}
            className={styles.select}
          >
            <option value="all">All</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Shortlet">Shortlet</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Property Type:</label>
          <select
            value={filter.propertyType}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
            className={styles.select}
          >
            <option value="all">All</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Duplex">Duplex</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Mansion">Mansion</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
            <option value="Office Space">Office Space</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>State:</label>
          <select
            value={filter.state}
            onChange={(e) => handleFilterChange("state", e.target.value)}
            className={styles.select}
          >
            <option value="all">All States</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">FCT</option>
            <option value="Rivers">Rivers</option>
            <option value="Oyo">Oyo</option>
            <option value="Kano">Kano</option>
          </select>
        </div>
      </div>

      {loading && <Loading message="Loading properties..." />}

      {!loading && properties.length === 0 ? (
        <div className={styles.empty}>
          <p>No properties found matching your criteria.</p>
        </div>
      ) : (
        !loading && (
          <>
            <div className={styles.resultInfo}>
              Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, totalProperties)} of{" "}
              {totalProperties} properties
            </div>

            <div className={styles.grid}>
              {properties.map((property) => (
                <div key={property.id} className={styles.card}>
                  <ImageGallery
                    images={property.images}
                    title={property.title}
                    listingType={property.listing_type}
                  />

                  <div className={styles.content}>
                    <h3 className={styles.propertyTitle}>{property.title}</h3>
                    <p className={styles.location}>
                      📍 {property.city}, {property.state}
                    </p>

                    <div className={styles.details}>
                      <span className={styles.type}>
                        {property.property_type}
                      </span>
                      {property.bedrooms && (
                        <span>🛏️ {property.bedrooms} Beds</span>
                      )}
                      {property.bathrooms && (
                        <span>🚿 {property.bathrooms} Baths</span>
                      )}
                      {property.size && <span>📏 {property.size} sqm</span>}
                    </div>

                    <p className={styles.description}>{property.description}</p>

                    {property.features && property.features.length > 0 && (
                      <div className={styles.features}>
                        {property.features.map((feature, index) => (
                          <span key={index} className={styles.featureTag}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={styles.footer}>
                      <div className={styles.price}>
                        {formatPrice(property.price)}
                      </div>
                      <a
                        href={`https://wa.me/2348023388329?text=${encodeURIComponent(
                          `Hello, I am interested in the property titled "${property.title}" at  ${property.address} ${property.city}, ${property.state}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className={styles.contactBtn}>
                          Contact Us
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className={styles.pageNumbers}>
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      className={`${styles.pageNumber} ${
                        page === currentPage ? styles.active : ""
                      } ${page === "..." ? styles.dots : ""}`}
                      onClick={() =>
                        typeof page === "number" && handlePageChange(page)
                      }
                      disabled={page === "..."}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className={styles.pageBtn}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}

function ImageGallery({ images, title, listingType }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.imageWrapper}>
      {images && images.length > 0 ? (
        <img src={images[currentIndex]} alt={title} className={styles.image} />
      ) : (
        <div className={styles.noImage}>No Image Available</div>
      )}
      <div className={styles.badge}>{listingType}</div>
      <button className={styles.previousButtons} onClick={handlePrevious}>
        &larr;
      </button>
      <button className={styles.nextButtons} onClick={handleNext}>
        &rarr;
      </button>
    </div>
  );
}

export default PublicShowProperties;
