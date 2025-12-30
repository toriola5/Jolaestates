import { useState, useEffect } from "react";

/* Custom hook to track window width and a clicked state it is used in the nav bar to track
the width of the nav bar for to know if it is a moblie or desktop view */
function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setClicked(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return [windowWidth, clicked, setClicked];
}

export default useWindowWidth;
