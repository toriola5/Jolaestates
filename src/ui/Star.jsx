function Star({ num = 5 }) {
  const emptyStars = 5 - num;
  return (
    <>
      {Array.from({ length: num }).map((_, index) => (
        <span key={index}>⭐</span>
      ))}
      {emptyStars > 0 &&
        Array.from({ length: emptyStars }).map((_, index) => (
          <span key={index}>☆</span>
        ))}
    </>
  );
}

export default Star;
