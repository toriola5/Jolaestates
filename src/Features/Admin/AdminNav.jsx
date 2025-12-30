import { supabase } from "../../Utils/Supabase";

import styles from "./AdminNav.module.css";
import { NavLink } from "react-router-dom";

function AdminNav() {
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
          <NavLink to="/admin/properties" className={styles.navBtn}>
            📋 Show Properties
          </NavLink>
          <NavLink to="/admin/upload-property" className={styles.navBtn}>
            ➕ Add Listings
          </NavLink>
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
