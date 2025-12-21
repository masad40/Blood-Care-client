import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { RouterProvider } from "react-router";
import { router } from "./routes/Routes";
import AuthContextProvider from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>

      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
  
    </AuthContextProvider>
  </React.StrictMode>
);
