import styles from "./Review.module.css";
import useReview from "../../hooks/useReview";
import SubmitedReview from "./SubmitedReview";
import Loading from "../../ui/Loading";
import ErrorMsg from "../../ui/ErrorMsg";
import Testimonial from "./Testimonial";

function Review() {
  const [
    formData,
    hoveredRating,
    handleChange,
    handleRatingClick,
    setHoveredRating,
    handleSubmit,
    isLoading,
    isSubmitted,
    error,
    setError,
  ] = useReview();

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && error && <ErrorMsg message={error} setError={setError} />}
      {!isLoading && !error && isSubmitted && <SubmitedReview />}
      {!isLoading && !error && !isSubmitted && (
        <div className={styles.reviewContainer} id="review">
          <div className={styles.reviewContent}>
            <h2 htmlFor="review" className={styles.title}>
              Share Your Experience
            </h2>
            <p className={styles.subtitle}>
              We value your feedback and would love to hear about your
              experience with Jola Estates
            </p>

            <form onSubmit={handleSubmit} className={styles.reviewForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>
                    Title *
                  </label>
                  <select
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr.</option>
                    <option value="Prof">Prof.</option>
                    <option value="Chief">Chief</option>
                    <option value="Hon">Hon.</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Rating *</label>
                <div className={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.star} ${
                        star <= (hoveredRating || formData.rating)
                          ? styles.starFilled
                          : ""
                      }`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      ★
                    </button>
                  ))}
                  <span className={styles.ratingText}>
                    {formData.rating > 0
                      ? `${formData.rating} out of 5`
                      : "Select a rating"}
                  </span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="comments" className={styles.label}>
                  Comments *
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  required
                  className={styles.textarea}
                  placeholder="Share your experience with us..."
                  rows="6"
                  maxLength={300}
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
      <Testimonial />
    </>
  );
}

export default Review;
