import styles from "./Testimonial.module.css";
import Stars from "./Star.jsx";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../Utils/firebase.js";
import ErrorMsg from "./ErrorMsg.jsx";
import Loading from "./Loading.jsx";

function Testimonial() {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "Comments"));

    // onSnapshot accepts a second argument for errors
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTestimonialsData(commentsArray);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching testimonials:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (error) {
    return (
      <>
        <h2 className={styles.testimonialTitle}>What Our Clients Say</h2>
        <ErrorMsg
          message={`Failed to load testimonials ${error}`}
          setError={setError}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <h2 className={styles.testimonialTitle}>What Our Clients Say</h2>
        <Loading message="Loading testimonials..." />
      </>
    );
  }

  return (
    <>
      <h2 className={styles.testimonialTitle}>What Our Clients Say</h2>
      <div className={styles.testimonialSlider}>
        {testimonialsData.map((testimonial, index) => (
          <div key={index} className={styles.testimonial}>
            <div>
              <Stars num={testimonial.rating} />
            </div>
            <p>"{testimonial.review}"</p>
            <cite>{`${testimonial.salutation} ${testimonial.fullname}`}</cite>
          </div>
        ))}
      </div>
    </>
  );
}

export default Testimonial;
