import Logo from "./Logo";
import styles from "./Nav.module.css";
import useWindowWidth from "../../hooks/useWindowWidth";
import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/hero", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services" },
  { to: "/faqs", label: "FAQs" },
  { to: "/blog", label: "Blog" },
  { to: "/review", label: "Review" },
  { to: "/listings", label: "Available Listings" },
  { to: "/admin", label: "Admin Login" },
];

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
            aria-label="Toggle navigation menu"
            aria-expanded={clicked}
          >
            <span className={styles["nav-toggle-bar"]}></span>
            <span className={styles["nav-toggle-bar"]}></span>
            <span className={styles["nav-toggle-bar"]}></span>
          </button>
        ) : (
          <ul className={styles.ul}>
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to}>{label}</NavLink>
              </li>
            ))}
          </ul>
        )}

        {isMobile && clicked && (
          <div className={styles.outSideNav}>
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setClicked(false)}>
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

export default Nav;
