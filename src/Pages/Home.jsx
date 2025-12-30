import Nav from "../Features/Home/Nav.jsx";
import Hero from "../Features/Home/Hero.jsx";
import Services from "../Features/Home/Services.jsx";
import About from "../Features/Home/About.jsx";
import Blog from "../Features/Home/Blog.jsx";
import Testimonial from "../Features/Home/Testimonial.jsx";
import Faqs from "../Features/Home/Faqs.jsx";
import Review from "../Features/Home/Review.jsx";
import Contact from "../Features/Home/Contact.jsx";
import Credit from "../Features/Home/Credit.jsx";
import { Outlet } from "react-router-dom";
function Home() {
  return (
    <div>
      <>
        <Nav />
        {/* <Hero /> */}
        {/* <Services />
        <About />
        <Blog />
        <Faqs />
        <Testimonial />
        <Review /> */}
        <Outlet />
        <Contact />
        <Credit />
      </>
    </div>
  );
}

export default Home;
