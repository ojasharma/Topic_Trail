import React, { useState, useEffect } from "react";

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const circleStyle = {
    position: "absolute",
    top: `${position.y - 5000 / 2}px`,
    left: `${position.x - 5000 / 2}px`,
    width: "5000px",
    height: "5000px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(115, 49, 172, 0.3) 0%, rgba(0, 0, 0, 0) 20%)",
    pointerEvents: "none",
    transition: "all 0.5s ",
    zIndex: "9999",
    mixBlendMode: "screen",
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "black",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={circleStyle}></div>
    </div>
  );
};

export default CursorEffect;
