import Logo from "./Logo";
import styles from "./Nav.module.css";
import useWindowWidth from "../../hooks/useWindowWidth";
import { NavLink } from "react-router-dom";

function Nav() {
  const [width, clicked, setClicked] = useWindowWidth();
  const isMobile = width < 900;
  return (
    <>
      <nav className={styles.nav}>
        <Logo />
        {isMobile ? (
          <button
            className={styles["nav-toggle"]}
            onClick={() => setClicked((e) => !e)}
          >
            <span className={styles["nav-toggle-bar"]}></span>
            <span className={styles["nav-toggle-bar"]}></span>
            <span className={styles["nav-toggle-bar"]}></span>
          </button>
        ) : (
          <ul className={styles.ul}>
            <li>
              <NavLink to="/hero">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About Us</NavLink>
            </li>
            <li>
              {/* <a href="#services-head">Our Services</a> */}
              <NavLink to="/services">Our Services</NavLink>
            </li>
            <li>
              {/* <a href="#faqs">FAQs</a> */}
              <NavLink to="/faqs">Faqs</NavLink>
            </li>
            <li>
              {/* <a href="#blog">Blog Post</a> */}
              <NavLink to="/blog">Blog</NavLink>
            </li>
            <li>
              {/* <a href="#review">Review</a> */}
              <NavLink to="/review">Review</NavLink>
            </li>
            <li>
              <NavLink to="/listings">Available listings</NavLink>
            </li>
            <li>
              <NavLink to="/admin">Admin Login</NavLink>
            </li>
          </ul>
        )}

        {isMobile && clicked && (
          <div className={styles.outSideNav}>
            {/* TODO: Fix the moboile version of navlinks */}
            {/* <a href="#nav" onClick={() => setClicked((x) => !x)}>
              Home
            </a> */}
            <NavLink to="/hero" onClick={() => setClicked((x) => !x)}>
              Home
            </NavLink>
            {/* <a href="#about" onClick={() => setClicked((x) => !x)}>
              About Us
            </a> */}
            <NavLink to="/about" onClick={() => setClicked((x) => !x)}>
              About Us
            </NavLink>
            {/* <a href="#contact" onClick={() => setClicked((x) => !x)}>
              Contact Us
            </a> */}
            {/* <a href="#services-head" onClick={() => setClicked((x) => !x)}>
              Our Services
            </a> */}
            <NavLink to="/services" onClick={() => setClicked((x) => !x)}>
              Our Services
            </NavLink>
            {/* <a href="#faqs" onClick={() => setClicked((x) => !x)}>
              FAQs
            </a> */}
            <NavLink to="/faqs" onClick={() => setClicked((x) => !x)}>
              Faqs
            </NavLink>
            {/* <a href="#blog" onClick={() => setClicked((x) => !x)}>
              Blog Post
            </a> */}
            <NavLink to="/blog" onClick={() => setClicked((x) => !x)}>
              Blog
            </NavLink>
            {/* <a href="#review" onClick={() => setClicked((x) => !x)}>
              Review
            </a> */}
            <NavLink to="/review" onClick={() => setClicked((x) => !x)}>
              Review
            </NavLink>
            <NavLink to="/listings">Available listings</NavLink>
            <NavLink to="/admin">Admin Login</NavLink>
          </div>
        )}
      </nav>
    </>
  );
}

export default Nav;
