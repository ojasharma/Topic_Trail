import React, { useRef } from "react";

const WelcomeText = () => {
  const textRef = useRef(null);

  const handleMouseMove = (e) => {
    const text = textRef.current;
    if (!text) return;

    const rect = text.getBoundingClientRect();
    const x = e.clientX - rect.left; // X position relative to the text
    const y = e.clientY - rect.top; // Y position relative to the text

    // Calculate rotation values and limit them to avoid overflow
    const rotateX = Math.min(Math.max((y / rect.height - 0.5) * -15, -10), 10); // Limit to -10 to 10 degrees
    const rotateY = Math.min(Math.max((x / rect.width - 0.5) * 15, -10), 10); // Limit to -10 to 10 degrees

    // Apply 3D rotation with perspective
    text.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    // Reset the text's transform when the cursor leaves
    const text = textRef.current;
    if (text) {
      text.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    }
  };

  return (
    <h1
      ref={textRef}
      className="mb-8 text-4xl font-bold text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        willChange: "transform",
        transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)", // Easy ease animation
        maxWidth: "80%", // Limit the width of the text
        margin: "0 auto", // Center the text horizontally
        textAlign: "center", // Center the text content
      }}
    >
      Welcome to Topic Trail
    </h1>
  );
};

export default WelcomeText;
