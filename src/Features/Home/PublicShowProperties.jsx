import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { supabase } from "../../Utils/Supabase.js";
import styles from "./PublicShowProperties.module.css";
import Loading from "../../ui/Loading.jsx";
import { NavLink } from "react-router-dom";
import Nav from "./Nav.jsx";
import { getPageNumbers, formatPrice } from "../../Utils/helper.js";

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
  const preloadedImagesRef = useRef(new Set());

  // Function to preload images
  const preloadImages = useCallback((imageUrls) => {
    imageUrls.forEach((url) => {
      if (!preloadedImagesRef.current.has(url)) {
        const img = new Image();
        img.src = url;
        preloadedImagesRef.current.add(url);
      }
    });
  }, []);

  // Function to fetch properties for a specific page (used for preloading)
  const fetchPropertiesForPage = useCallback(
    async (page) => {
      try {
        const from = (page - 1) * itemsPerPage;
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

        // Extract and preload all images from the fetched properties
        const allImages = (data || []).flatMap(
          (property) => property.images || [],
        );
        preloadImages(allImages);
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    },
    [filter, itemsPerPage, preloadImages],
  );

  const fetchProperties = useCallback(async () => {
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

      // Preload images from current page
      const currentImages = (data || []).flatMap(
        (property) => property.images || [],
      );
      preloadImages(currentImages);

      // Preload next and previous pages' images in the background
      const totalPages = Math.ceil((count || 0) / itemsPerPage);
      if (currentPage < totalPages) {
        // Preload next page
        setTimeout(() => fetchPropertiesForPage(currentPage + 1), 500);
      }
      if (currentPage > 1) {
        // Preload previous page
        setTimeout(() => fetchPropertiesForPage(currentPage - 1), 500);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, preloadImages, fetchPropertiesForPage]);

  useEffect(() => {
    fetchProperties();
  }, [filter, currentPage, fetchProperties]);

  const handleFilterChange = (filterType, value) => {
    setFilter({ ...filter, [filterType]: value });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const totalPages = Math.ceil(totalProperties / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error loading properties: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className={styles.container}>
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
              onChange={(e) =>
                handleFilterChange("listingType", e.target.value)
              }
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
              onChange={(e) =>
                handleFilterChange("propertyType", e.target.value)
              }
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
                    <MediaGallery
                      images={property.images}
                      videos={property.video_urls}
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
                        {property.toilet && (
                          <span>🚽 {property.toilet} Toilets</span>
                        )}
                        {property.size && <span>📏 {property.size} sqm</span>}
                      </div>

                      <p className={styles.description}>
                        {property.description}
                      </p>

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
                            `Hello, I am interested in the property titled "${property.title}" at  ${property.address} ${property.city}, ${property.state}.`,
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
                    {getPageNumbers(currentPage, totalPages).map(
                      (page, index) => (
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
                      ),
                    )}
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
    </>
  );
}

function MediaGallery({ images, videos, title, listingType }) {
  // Combine images and videos into a single media array
  const media = useMemo(
    () => [
      ...(videos || []).map((url) => ({ type: "video", url })),
      ...(images || []).map((url) => ({ type: "image", url })),
    ],
    [images, videos],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    if (media.length > 1) {
      // Preload next image
      const nextIndex = (currentIndex + 1) % media.length;
      if (media[nextIndex]?.type === "image") {
        const img = new Image();
        img.src = media[nextIndex].url;
      }

      // Preload previous image
      const prevIndex =
        currentIndex === 0 ? media.length - 1 : currentIndex - 1;
      if (media[prevIndex]?.type === "image") {
        const img = new Image();
        img.src = media[prevIndex].url;
      }
    }
  }, [currentIndex, media]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const currentMedia = media[currentIndex];

  return (
    <div className={styles.imageWrapper}>
      {media && media.length > 0 ? (
        currentMedia.type === "image" ? (
          <img src={currentMedia.url} alt={title} className={styles.image} />
        ) : (
          <video
            src={currentMedia.url}
            className={styles.image}
            controls
            style={{ width: "100%", height: "100%" }}
          />
        )
      ) : (
        <div className={styles.noImage}>No Media Available</div>
      )}
      <div className={styles.badge}>{listingType}</div>
      {media.length > 1 && (
        <>
          <button className={styles.previousButtons} onClick={handlePrevious}>
            &larr;
          </button>
          <button className={styles.nextButtons} onClick={handleNext}>
            &rarr;
          </button>
          <div className={styles.mediaCounter}>
            {currentIndex + 1} / {media.length}
          </div>
        </>
      )}
    </div>
  );
}

function VideoGallery({ videos }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!videos || videos.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.videoWrapper}>
      <video
        key={videos[currentIndex]}
        controls
        className={styles.video}
        style={{ width: "100%", maxHeight: "400px" }}
      >
        <source src={videos[currentIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {videos.length > 1 && (
        <>
          <button className={styles.previousButtons} onClick={handlePrevious}>
            &larr;
          </button>
          <button className={styles.nextButtons} onClick={handleNext}>
            &rarr;
          </button>
          <div className={styles.videoCounter}>
            Video {currentIndex + 1} of {videos.length}
          </div>
        </>
      )}
    </div>
  );
}

export default PublicShowProperties;
