import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WordPage from "./pages/WordPage";
import { WordStoreContext, createWordStore } from "./stores/useWordStore";

const wordStore = createWordStore();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/word",
    element: <WordPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WordStoreContext.Provider value={wordStore}>
      <RouterProvider router={router} />
    </WordStoreContext.Provider>
  </React.StrictMode>
);
