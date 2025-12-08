import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function useReview() {
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    rating: 0,
    comments: "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Review submitted:", formData);

    // Add your submission logic here
    try {
      setIsLoading(true);
      await addDoc(collection(db, "Comments"), {
        fullname: formData.fullName,
        rating: Number(formData.rating),
        review: formData.comments,
        salutation: formData.title,
      });
      setIsSubmitted(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      setError(error.message);
      setIsLoading(false);
    }
    // Reset form
    setFormData({
      title: "",
      fullName: "",
      rating: 0,
      comments: "",
    });
  };

  return [
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
  ];
}

export default useReview;
