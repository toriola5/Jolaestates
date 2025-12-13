import Nav from "../Components/Nav.jsx";
import Hero from "../Components/Hero.jsx";
import Services from "../Components/Services.jsx";
import About from "../Components/About.jsx";
import Blog from "../Components/Blog.jsx";
import Testimonial from "../Components/Testimonial.jsx";
import Faqs from "../Components/Faqs.jsx";
import Review from "../Components/Review.jsx";
import Contact from "../Components/Contact.jsx";
import Credit from "../Components/Credit.jsx";
function Home() {
  return (
    <div>
      <>
        <Nav />
        <Hero />
        <Services />
        <About />
        <Blog />
        <Faqs />
        <Testimonial />
        <Review />
        <Contact />
        <Credit />
      </>
    </div>
  );
}

export default Home;
