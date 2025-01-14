import React, { useRef, useEffect } from "react";

const FeatureCard = ({
  title,
  description,
  imgSrc,
  initialRotationY,
  zAxisOffset,
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      // Apply initial rotation and Z-axis offset
      card.style.transform = `perspective(1000px) rotateY(${initialRotationY}deg) translateZ(${zAxisOffset}px)`;
    }
  }, [initialRotationY, zAxisOffset]);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // X position relative to the card
    const y = e.clientY - rect.top; // Y position relative to the card

    // Calculate rotation values
    const rotateX = (y / rect.height - 0.5) * -25; // Inverted to tilt correctly
    const rotateY = (x / rect.width - 0.5) * 25;

    // Apply 3D rotation, initial Z-axis offset, and perspective
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${
      rotateY + initialRotationY
    }deg) translateZ(${zAxisOffset}px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      // Reset to initial rotation and Z-axis offset
      card.style.transform = `perspective(1000px) rotateY(${initialRotationY}deg) translateZ(${zAxisOffset}px)`;
    }
  };

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-64 p-6 mx-2 bg-gray-800 text-white dark:bg-gray-800 rounded-lg shadow-lg dark:text-white"
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
        <h3 className="text-xl font-semibold text-white dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-gray-300 dark:text-gray-300 glowing-description">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
