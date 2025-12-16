import { supabase } from "../Utils/Supabase";
import { useContext } from "react";
import { AdminContext } from "../Contexts/AdminProvider";
import styles from "./AdminNav.module.css";
import { NavLink } from "react-router-dom";

function AdminNav() {
  const { dispatch } = useContext(AdminContext);
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };
  return (
    <nav className={styles.adminNav}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <h1>Admin Panel</h1>
        </div>

        <div className={styles.navButtons}>
          <button
            className={styles.navBtn}
            onClick={() =>
              dispatch({
                type: "SET_ACTIVE_PAGE",
                payload: { page: "SHOW_PROPERTIES" },
              })
            }
          >
            📋 Show Properties
          </button>
          <button
            className={styles.navBtn}
            onClick={() =>
              dispatch({
                type: "SET_ACTIVE_PAGE",
                payload: { page: "SHOW_UPLOAD_FORM" },
              })
            }
          >
            ➕ Add Listings
          </button>
          <NavLink to="/" className={styles.navBtn}>
            &larr; Home
          </NavLink>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNav;
