import { NavLink } from "react-router-dom";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <div className={styles.hero} id="nav">
      <h1>
        We don't just sell <br />
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
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>10+</span>
          <span className={styles.statLabel}>Years Experience</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>100+</span>
          <span className={styles.statLabel}>Happy Clients</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>6</span>
          <span className={styles.statLabel}>Services</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>2014</span>
          <span className={styles.statLabel}>Established</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
