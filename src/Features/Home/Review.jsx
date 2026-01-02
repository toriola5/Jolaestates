import styles from "./Review.module.css";
import useReview from "../../hooks/useReview";
import SubmitedReview from "./SubmitedReview";
import Testimonial from "./Testimonial";
import { Form, useActionData, useNavigation } from "react-router-dom";

function Review() {
  const [rating, hoveredRating, handleRatingClick, setHoveredRating] =
    useReview();

  const message = useActionData();
  const navigate = useNavigation();
  const isSubmitting = navigate.state === "submitting";
  return (
    <>
      {message?.success && <SubmitedReview />}
      {!message?.success && (
        <div className={styles.reviewContainer} id="review">
          {message?.submiterror && (
            <p className={styles.errorMessage}>{message.submiterror}</p>
          )}
          <div className={styles.reviewContent}>
            <h2 htmlFor="review" className={styles.title}>
              Share Your Experience
            </h2>
            <p className={styles.subtitle}>
              We value your feedback and would love to hear about your
              experience with Jola Estates
            </p>

            <Form method="POST" action="/review" className={styles.reviewForm}>
              {/* Hidden input for rating */}
              <input type="hidden" name="rating" value={rating} />

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>
                    Title
                  </label>
                  <select
                    id="title"
                    name="title"
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
                        star <= (hoveredRating || rating)
                          ? styles.starFilled
                          : ""
                      }`}
                      onClick={() => {
                        handleRatingClick(star);
                        // Update the hidden input value
                        const hiddenInput = document.querySelector(
                          'input[name="rating"]'
                        );
                        if (hiddenInput) hiddenInput.value = star;
                      }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      ★
                    </button>
                  ))}
                  <span className={styles.ratingText}>
                    {rating > 0 ? `${rating} out of 5` : "Select a rating"}
                  </span>
                </div>
              </div>
              {message?.ratingerror && (
                <p className={styles.errorMessage}>{message.ratingerror}</p>
              )}
              <div className={styles.formGroup}>
                <label htmlFor="comments" className={styles.label}>
                  Comments *
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  required
                  className={styles.textarea}
                  placeholder="Share your experience with us..."
                  rows="6"
                  maxLength={300}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </Form>
          </div>
        </div>
      )}
      <Testimonial />
    </>
  );
}

export default Review;
