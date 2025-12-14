import { useState, useEffect } from "react";
import { supabase } from "../Utils/Supabase";
import styles from "./PublicShowProperties.module.css";

//TODO: Add pagination for better performance with large datasets
//TODO: Improve UI/UX design
//TODO: Add more filter options (price range, bedrooms, bathrooms, etc.)
//TODO: Add sorting options (price low to high, newest listings, etc.)
//TODO : Add navigation to the image gallery of each property {left and right arrows}

function PublicShowProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    listingType: "all",
    propertyType: "all",
    state: "all",
  });

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

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
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error loading properties: {error}</div>
      </div>
    );
  }

  return (
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

      {properties.length === 0 ? (
        <div className={styles.empty}>
          <p>No properties found matching your criteria.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {properties.map((property) => (
            <div key={property.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.noImage}>No Image Available</div>
                )}
                <div className={styles.badge}>{property.listing_type}</div>
              </div>

              <div className={styles.content}>
                <h3 className={styles.propertyTitle}>{property.title}</h3>
                <p className={styles.location}>
                  📍 {property.city}, {property.state}
                </p>

                <div className={styles.details}>
                  <span className={styles.type}>{property.property_type}</span>
                  {property.bedrooms && (
                    <span>🛏️ {property.bedrooms} Beds</span>
                  )}
                  {property.bathrooms && (
                    <span>🚿 {property.bathrooms} Baths</span>
                  )}
                  {property.size && <span>📏 {property.size} sqm</span>}
                </div>

                <p className={styles.description}>
                  {property.description.length > 100
                    ? `${property.description.substring(0, 100)}...`
                    : property.description}
                </p>

                {property.features && property.features.length > 0 && (
                  <div className={styles.features}>
                    {property.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className={styles.featureTag}>
                        {feature}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className={styles.featureTag}>
                        +{property.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className={styles.footer}>
                  <div className={styles.price}>
                    {formatPrice(property.price)}
                  </div>
                  <button className={styles.contactBtn}>Contact Us</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicShowProperties;
