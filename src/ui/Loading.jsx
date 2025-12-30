import styles from "./Loading.module.css";

function Loading({ message = "loading..." }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.dotsContainer}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        <p className={styles.loadingText}>{message}</p>
      </div>
    </div>
  );
}

export default Loading;
