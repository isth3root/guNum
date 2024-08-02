// ========== PACKAGES ========== \\
import React from "react";
import ReactDOM from "react-dom/client";

// ========== CONTEXTES ========== \\
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// ========== STYLES ========== \\
import "./index.css";


import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
