import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
// import LocomotiveScroll from "locomotive-scroll";

// const scroll = new LocomotiveScroll({
//   lenisOptions: {
//     wrapper: document.querySelector("#root") as HTMLElement | undefined,
//     content: document.querySelector("[data-scroll-container]") as
//       | HTMLElement
//       | undefined,
//     lerp: 0.1,
//     duration: 1.2,
//     orientation: "vertical",
//     gestureOrientation: "vertical",
//     smoothWheel: true,
//     wheelMultiplier: 1,
//     touchMultiplier: 2,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
//   },
// });

// scroll.start();

// new LocomotiveScroll({
//   // wrapper (HTMLElement|Window): Specifies the element that will be used as the scroll container.
//   // wrapper: document.querySelector("#root"),
//   // content: document.querySelector("[data-scroll-container]"),
//   // smooth: true,
//   lenisOptions: {
//     lerp: 0.1,
//     duration: 1.2,
//     orientation: "vertical",
//     gestureOrientation: "vertical",
//     smoothWheel: true,
//     // smoothTouch: false,
//     wheelMultiplier: 1,
//     touchMultiplier: 2,
//     // normalizeWheel: true,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
//   },
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
