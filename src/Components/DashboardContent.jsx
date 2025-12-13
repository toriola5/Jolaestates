import { useContext } from "react";
import { AdminContext } from "../Contexts/AdminProvider";
import AdminNav from "./AdminNav";
import PropertyUpload from "./PropertyUpload";
import AdminShowProperties from "./AdminShowProperties";
function DashboardContent() {
  const { activepage } = useContext(AdminContext);
  return (
    <>
      <AdminNav />
      {activepage === "SHOW_UPLOAD_FORM" && <PropertyUpload />}
      {activepage === "SHOW_PROPERTIES" && <AdminShowProperties />}
    </>
  );
}
export default DashboardContent;
