import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../Utils/Supabase.js";
import styles from "./AdminShowProperties.module.css";
import Loading from "../../ui/Loading.jsx";
import MessageAlert from "../../ui/MessageAlert.jsx";
import { Link, useParams } from "react-router-dom";
import {
  queryAdminProperties,
  getTotalPropertiesCount,
  deletePropertyByID,
} from "../../Services/propertyQuery.js";
import { formatPrice, formatDate, getPageNumbers } from "../../Utils/helper.js";

//TODO: Improve UI/UX design
//TODO : Add request a call back functionality

function AdminShowProperties() {
  const params = useParams();
  const messageParam = params.message;
  const [message, setMessage] = useState({ type: null, content: null });
  //§tate variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  //Items per page
  const itemsPerPage = 10;

  const fetchProperties = useCallback(
    async function fetchProperties() {
      try {
        setLoading(true);

        const count = await getTotalPropertiesCount();

        setTotalProperties(count || 0);

        // Get paginated data
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        const data = await queryAdminProperties(from, to);
        setProperties(data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  //Fetch properties on page load and when currentPage changes
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties, currentPage]);

  useEffect(() => {
    if (messageParam === "1") {
      setMessage({
        type: "success",
        content: "Property uploaded successfully!",
      });
    }
    if (messageParam === "2") {
      setMessage({
        type: "success",
        content: "Property updated successfully!",
      });
    }
  }, [messageParam]);

  // Auto-clear messages after 3 seconds
  useEffect(() => {
    if (message.content) {
      const timer = setTimeout(() => {
        setMessage({ type: null, content: null });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message.content]);

  // Console log success message from uploadProperty action

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      // const { error } = await supabase.from("properties").delete().eq("id", id);
      await deletePropertyByID(id);

      // Remove from local state
      setProperties(properties.filter((prop) => prop.id !== id));

      setMessage((message) => ({
        ...message,
        type: "success",
        content: "Property deleted successfully!",
      }));
    } catch (error) {
      console.error("Error deleting property:", error);

      setMessage((message) => ({
        ...message,
        type: "error",
        content: `Failed to delete property: ${error.message}`,
      }));
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const { error } = await supabase
        .from("properties")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setProperties(
        properties.map((prop) =>
          prop.id === id ? { ...prop, status: newStatus } : prop
        )
      );

      setMessage({
        type: "success",
        content: `Property status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error toggling status:", error);

      setMessage({
        type: "error",
        content: `Failed to update status: ${error.message}`,
      });
    }
  };

  const totalPages = Math.ceil(totalProperties / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loading message="Loading properties..." />;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>All Properties</h2>
        <p className={styles.count}>Total: {totalProperties} properties</p>
      </div>
      {message.type && (
        <MessageAlert message={message.content} type={message.type} />
      )}
      {!loading && properties.length > 0 && (
        <div className={styles.resultInfo}>
          Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, totalProperties)} of{" "}
          {totalProperties} properties
        </div>
      )}

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
                <th>Toilets</th>
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
                  <td>{property.toilet || "N/A"}</td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[property.status]}`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td>{formatDate(property.created_at)}</td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                    <Link
                      to={`/admin/edit-property/${property.id}`}
                      className={styles.editBtn}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        handleStatusToggle(property.id, property.status)
                      }
                      className={styles.statusBtn}
                    >
                      {property.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className={styles.pageNumbers}>
            {getPageNumbers(currentPage, totalPages).map((page, index) => (
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
    </div>
  );
}

export default AdminShowProperties;
