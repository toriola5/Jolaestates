import { useState, useEffect } from "react";
import Login from "../Components/Login";
import { supabase } from "../Utils/Supabase";
import Loading from "../Components/Loading";
import Dashboard from "../Components/Dashboard";

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

  if (loading) {
    return <Loading />;
  }

  return <>{session ? <Dashboard /> : <Login />}</>;
}

export default Admin;
