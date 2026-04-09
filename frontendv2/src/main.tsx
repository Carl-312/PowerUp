import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./app/router";
import "./app/app.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Unable to find the frontendv2 root element.");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
