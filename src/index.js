import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Hangman from "./Hangman";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Hangman />
  </StrictMode>
);
