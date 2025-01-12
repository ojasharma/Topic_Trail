import React, { useRef } from "react";

const FeatureCard = ({ title, description, imgSrc }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // X position relative to the card
    const y = e.clientY - rect.top; // Y position relative to the card

    // Calculate rotation values
    const rotateX = (y / rect.height - 0.5) * -15; // Inverted to tilt correctly
    const rotateY = (x / rect.width - 0.5) * 15;

    // Apply 3D rotation with perspective
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    // Reset the card's transform when the cursor leaves
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    }
  };

  // Function to add glowing effect to keywords
  const highlightKeywords = (text) => {
    const keywords = [
      "performance",
      "feature",
      "premium",
      "easy",
      "advanced",
      "quick",
    ];

    return text.split(" ").map((word, index) => {
      if (keywords.includes(word.toLowerCase())) {
        return (
          <span key={index} className="glowing-text">
            {word}
          </span>
        );
      }
      return word + " ";
    });
  };

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-64 p-6 mx-2 bg-white rounded-lg shadow-lg dark:bg-gray-800"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        willChange: "transform",
        transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      <div className="flex items-center mb-2">
        <img
          src={imgSrc}
          alt={title}
          className="w-8 h-8 mr-2"
          style={{ filter: "invert(1)" }} // Make the logo white using invert
        />
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 glowing-description">
        {highlightKeywords(description)}
      </p>
    </div>
  );
};

export default FeatureCard;
