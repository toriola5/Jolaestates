import styles from "./SubmitedReview.module.css";

function SubmitedReview() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.checkmark}>
            <svg viewBox="0 0 52 52" className={styles.checkmarkSvg}>
              <circle
                cx="26"
                cy="26"
                r="25"
                fill="none"
                className={styles.checkmarkCircle}
              />
              <path
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                className={styles.checkmarkCheck}
              />
            </svg>
          </div>
        </div>

        <h2 className={styles.title}>Thank You!</h2>
        <p className={styles.message}>
          We truly appreciate you taking the time to share your experience with
          us. Your feedback helps us improve our services and better serve our
          clients.
        </p>

        {/* <div className={styles.details}>
          <p className={styles.detailText}>
            <span className={styles.icon}>📧</span>
            You'll receive a confirmation email shortly
          </p>
          <p className={styles.detailText}>
            <span className={styles.icon}>⭐</span>
            Your review will be published after verification
          </p>
        </div>

        <button
          className={styles.button}
          onClick={() => window.location.reload()}
        >
          Submit Another Review
        </button> */}
      </div>
    </div>
  );
}

export default SubmitedReview;
