import { useState, useEffect } from "react";
import { supabase } from "../Utils/Supabase";
import styles from "./AdminShowProperties.module.css";
import Loading from "./Loading.jsx";
import MessageAlert from "./MessageAlert.jsx";
import { useContext } from "react";
import { AdminContext } from "../Contexts/AdminProvider.jsx";

//TODO: Improve UI/UX design
//TODO : Add request a call back functionality

function AdminShowProperties() {
  // Get dispatch and message from context
  const { dispatch, message, messageType } = useContext(AdminContext);

  //§tate variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  //Items per page
  const itemsPerPage = 10;

  //Fetch properties on page load and when currentPage changes
  useEffect(() => {
    fetchProperties();
  }, [currentPage]);

  //Use effect to clear messages after 1 second
  useEffect(
    function () {
      if (message) {
        const timer = setTimeout(
          () => dispatch({ type: "CLEAR_MESSAGE" }),
          1000
        );
        return () => clearTimeout(timer);
      }
    },
    [message, dispatch]
  );

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Get total count
      const { count } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });

      setTotalProperties(count || 0);

      // Get paginated data
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, title, property_type, listing_type, price, state, city, bedrooms, bathrooms, toilet, status, created_at"
        )
        .order("created_at", { ascending: false })
        .range(from, to);

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
      dispatch({
        type: "SET_MESSAGE",
        payload: {
          message: "Property deleted successfully!",
          type: "success",
        },
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      dispatch({
        type: "SET_MESSAGE",
        payload: {
          message: `Failed to delete property: ${error.message}`,
          type: "error",
        },
      });
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
      dispatch({
        type: "SET_MESSAGE",
        payload: {
          message: `Property status updated to ${newStatus}`,
          type: "success",
        },
      });
    } catch (error) {
      console.error("Error toggling status:", error);
      dispatch({
        type: "SET_MESSAGE",
        payload: {
          message: `Failed to update status: ${error.message}`,
          type: "error",
        },
      });
    }
  };

  function handleEdit(id) {
    //Get form data of this id
    dispatch({
      type: "SET_ACTIVE_PAGE",
      payload: { id: id, page: "EDIT_PROPERTY_FORM" },
    });
  }

  const totalPages = Math.ceil(totalProperties / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    // Logic for displaying page numbers with ellipses
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
      {message && <MessageAlert message={message} type={messageType} />}

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
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(property.id)}
                    >
                      Edit
                    </button>
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
    </div>
  );
}

export default AdminShowProperties;
