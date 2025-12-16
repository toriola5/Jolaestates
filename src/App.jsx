import Home from "./Pages/Home";
import Admin from "./Pages/Admin.jsx";
import PublicShowProperties from "./Components/PublicShowProperties.jsx";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
        <Route path="/listings" element={<PublicShowProperties />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
