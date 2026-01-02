import { useState } from "react";

function useReview() {
  const [rating, setRating] = useState(0);

  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingClick = (rating) => {
    setRating(rating);
  };

  return [rating, hoveredRating, handleRatingClick, setHoveredRating];
}

export default useReview;
