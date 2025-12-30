import styles from "./Logo.module.css";
function Logo() {
  return (
    <img className={styles.img} src="/logo.jpeg" alt="Jola Estates Logo" />
  );
}

export default Logo;
