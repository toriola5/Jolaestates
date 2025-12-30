import { useState, useEffect } from "react";
import Login from "../Features/Admin/Login";
import { supabase } from "../Utils/Supabase";
import Loading from "../ui/Loading";
import { Outlet } from "react-router-dom";
import AdminNav from "../Features/Admin/AdminNav";
import { AdminProvider } from "../Contexts/AdminProvider";

function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <Loading />;

  // If no session, show login within this component (not navigate away)
  if (!session) return <Login />;

  return (
    <>
      <AdminProvider>
        <AdminNav />
        <Outlet />
      </AdminProvider>
    </>
  );
}

export default Admin;
