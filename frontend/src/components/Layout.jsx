import React from "react";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensures footer is always at the bottom
      }}
    >
      <main style={{ flex: "1" }}>{children}</main>{" "}
      {/* Page-specific content */}
      <Footer />
    </div>
  );
}

export default Layout;
