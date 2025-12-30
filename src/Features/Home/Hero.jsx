import { NavLink } from "react-router-dom";
import styles from "./Hero.module.css";
function Hero() {
  return (
    <div className={styles.hero} id="nav">
      <h1>
        We dont just sell <br />
        <span> properties. </span> <br />
        we build futures.
      </h1>
      <div className={styles.actionables}>
        <NavLink to="/services">
          <button className={styles.primaryBtn}>Our Services</button>
        </NavLink>
        <NavLink to="/listings">
          <button className={styles.secondaryBtn}>Available Listings</button>
        </NavLink>
      </div>
    </div>
  );
}

export default Hero;
