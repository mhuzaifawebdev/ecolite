import { useState, useEffect } from "react";

const useWindowResize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window?.innerWidth,
    height: window?.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window?.innerWidth,
        height: window?.innerHeight,
      });
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowResize;

export function convertDate(inputDate) {
  // Create a new Date object from the input string
  const parsedDate = new Date(inputDate);

  // Extract year, month, and day from the parsed date
  const year = parsedDate.getFullYear().toString().slice(-2); // Get last 2 digits of the year
  const month = ("0" + (parsedDate.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ("0" + parsedDate.getDate()).slice(-2);

  // Construct the desired output format
  const outputDate = `${year}/${month}/${day}`;

  return outputDate;
}
