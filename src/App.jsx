import Home from "./Pages/Home";
import Admin from "./Pages/Admin.jsx";
import PublicShowProperties from "./Features/Home/PublicShowProperties.jsx";
import PropertyUpload from "./Features/Admin/PropertyUpload.jsx";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AdminShowProperties from "./Features/Admin/AdminShowProperties.jsx";
import Hero from "./Features/Home/Hero.jsx";
import Services from "./Features/Home/Services.jsx";
import About from "./Features/Home/About.jsx";
import Blog from "./Features/Home/Blog.jsx";
import Faqs from "./Features/Home/Faqs.jsx";
import Review from "./Features/Home/Review.jsx";
import {
  uploadReview,
  UploadProperty,
  loginAction,
} from "./Services/actions.js";
import Login from "./Features/Admin/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,

    children: [
      {
        index: true,
        element: <Hero />,
      },
      {
        path: "hero",
        element: <Hero />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "review",
        element: <Review />,
        action: uploadReview,
      },
      {
        path: "faqs",
        element: <Faqs />,
      },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,

    children: [
      {
        index: true,
        element: <Navigate to="/admin/properties" replace />,
      },
      {
        path: "upload-property",
        element: <PropertyUpload isEditMode={false} />,
        action: UploadProperty,
      },
      {
        path: "edit-property/:propertyId",
        element: <PropertyUpload isEditMode={true} />,
        action: UploadProperty,
      },
      {
        path: "properties/:message",
        element: <AdminShowProperties />,
      },
      {
        path: "properties",
        element: <AdminShowProperties />,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
      },
    ],
  },
  {
    path: "*",
    element: <Home />,
  },
  {
    path: "/listings",
    element: <PublicShowProperties />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
