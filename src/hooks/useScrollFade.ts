import { useEffect, useState } from "react";

export function useScrollFade(maxFade = 200) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeValue = Math.min(1, scrollY / maxFade);
      console.log(fadeValue);
      setOpacity(fadeValue);
    };

    // Set initial opacity
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [maxFade]);

  return opacity;
}
