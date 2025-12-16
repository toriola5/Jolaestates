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
        <a href="#services-head">
          <button className={styles.primaryBtn}>Our Services</button>
        </a>

        <NavLink to="/listings">
          <button className={styles.secondaryBtn}>Available Listings</button>
        </NavLink>
      </div>
    </div>
  );
}

export default Hero;
