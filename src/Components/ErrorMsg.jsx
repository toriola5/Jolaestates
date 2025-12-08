import styles from "./ErrorMsg.module.css";

function ErrorMsg({
  message = "An error occurred. Please try again.",
  setError = () => {},
}) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorCard}>
        <div className={styles.iconWrapper}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 8v4M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3 className={styles.errorTitle}>Oops! Something went wrong</h3>
        <p className={styles.errorMessage}>{message}</p>
        <button className={styles.retryButton} onClick={() => setError(null)}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export default ErrorMsg;
