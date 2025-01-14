import React, { useState, useEffect } from "react";

const TypewriterText = () => {
  const fullText = "AIpowered lecture management tool";
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [cursorOpacity, setCursorOpacity] = useState(1);

  // Handle typing animation
  useEffect(() => {
    let currentIndex = isTyping ? displayedText.length : fullText.length;
    let typingInterval;

    typingInterval = setInterval(() => {
      if (isTyping) {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setIsTyping(false), 1500);
        }
      } else {
        if (currentIndex > 0) {
          setDisplayedText(fullText.slice(0, currentIndex - 1));
          currentIndex--;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setIsTyping(true), 1500);
        }
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [isTyping]);

  // Handle cursor fade animation
  useEffect(() => {
    let fadeInterval = setInterval(() => {
      setCursorOpacity((prev) => {
        if (prev <= 0) return 1;
        return prev - 0.05; // Slower fade
      });
    }, 50); // Slower blink rate

    return () => clearInterval(fadeInterval);
  }, []);

  // Split the displayed text into AI and remaining text for different styling
  const aiPart = displayedText.slice(0, 2);
  const remainingPart = displayedText.slice(2);

  return (
    <p className="text-xl">
      <span
        style={{
          color: "#7331AC",
          fontFamily: "Roboto",
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginRight: aiPart.length === 2 ? "0.5rem" : "0",
        }}
      >
        {aiPart}
      </span>
      <span
        style={{
          color: "white",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        {remainingPart}
        <span
          style={{
            opacity: cursorOpacity,
            color: "white",
            fontSize: "4rem", // Larger cursor
            position: "relative",
            top: "13px",
            marginLeft: "2px",
            transition: "opacity 0.1s ease-in-out",
          }}
        >
          •
        </span>
      </span>
    </p>
  );
};

export default TypewriterText;
