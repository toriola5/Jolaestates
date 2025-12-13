import { AdminProvider } from "../Contexts/AdminProvider";
import DashboardContent from "./DashboardContent";

function Dashboard() {
  return (
    <AdminProvider>
      <DashboardContent />
    </AdminProvider>
  );
}

export default Dashboard;
