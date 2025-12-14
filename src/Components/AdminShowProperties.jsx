import { useState, useEffect } from "react";
import { supabase } from "../Utils/Supabase";
import styles from "./AdminShowProperties.module.css";

//TODO : Add pagination for better performance with large datasets
//TODO: Add edit functionality for properties
//TODO: Improve UI/UX design
//TODO: Add change status functionality (active, inactive, sold)
//TODO : Add request a call back functionality
function AdminShowProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, title, property_type, listing_type, price, state, city, bedrooms, bathrooms, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      // Remove from local state
      setProperties(properties.filter((prop) => prop.id !== id));
      alert("Property deleted successfully!");
    } catch (error) {
      console.error("Error deleting property:", error);
      alert(`Failed to delete property: ${error.message}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading properties...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>All Properties</h2>
        <p className={styles.count}>Total: {properties.length} properties</p>
      </div>

      {properties.length === 0 ? (
        <div className={styles.empty}>
          <p>No properties found. Upload your first property!</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Listing</th>
                <th>Price</th>
                <th>Location</th>
                <th>Beds</th>
                <th>Baths</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className={styles.title}>{property.title}</td>
                  <td>{property.property_type}</td>
                  <td>{property.listing_type}</td>
                  <td className={styles.price}>
                    {formatPrice(property.price)}
                  </td>
                  <td>
                    {property.city}, {property.state}
                  </td>
                  <td>{property.bedrooms || "N/A"}</td>
                  <td>{property.bathrooms || "N/A"}</td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[property.status]}`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td>{formatDate(property.created_at)}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminShowProperties;
