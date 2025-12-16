import Logo from "./Logo";
import styles from "./Nav.module.css";
import useWindowWidth from "../hooks/useWindowWidth";
import { NavLink } from "react-router-dom";

function Nav() {
  const [width, clicked, setClicked] = useWindowWidth();
  const isMobile = width < 768;
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
              <a href="#nav">Home</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
            <li>
              <a href="#services-head">Our Services</a>
            </li>
            <li>
              <a href="#faqs">FAQs</a>
            </li>
            <li>
              <a href="#blog">Blog Post</a>
            </li>
            <li>
              <a href="#review">Review</a>
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
            <a href="#nav" onClick={() => setClicked((x) => !x)}>
              Home
            </a>
            <a href="#about" onClick={() => setClicked((x) => !x)}>
              About Us
            </a>
            <a href="#contact" onClick={() => setClicked((x) => !x)}>
              Contact Us
            </a>
            <a href="#services-head" onClick={() => setClicked((x) => !x)}>
              Our Services
            </a>
            <a href="#faqs" onClick={() => setClicked((x) => !x)}>
              FAQs
            </a>
            <a href="#blog" onClick={() => setClicked((x) => !x)}>
              Blog Post
            </a>
            <a href="#review" onClick={() => setClicked((x) => !x)}>
              Review
            </a>
          </div>
        )}
      </nav>
    </>
  );
}

export default Nav;
