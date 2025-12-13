import { supabase } from "../Utils/Supabase";
import { useContext } from "react";
import { AdminContext } from "../Contexts/AdminProvider";
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
    <div>
      <button onClick={handleLogout}>Logout</button>
      <button
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_PAGE", payload: "SHOW_PROPERTIES" })
        }
      >
        Show Properties
      </button>
      <button
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_PAGE", payload: "SHOW_UPLOAD_FORM" })
        }
      >
        Show Upload Form
      </button>
    </div>
  );
}

export default AdminNav;
