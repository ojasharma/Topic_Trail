import React from "react";
import { Link } from "react-router-dom";
import CursorEffect from "./CursorEffect";
import TypewriterText from "./TypewriterText";
import FeatureCard from "./FeatureCard";
import WelcomeText from "./WelcomeTest";

const LandingPage = () => {
  const features = [
    {
      title: "Streamlined Class Management",
      description:
        "Effortlessly create and delete classes, join or leave using secure class codes, and seamlessly add or remove members while maintaining full control over class membership and engagement.",
      imgSrc: "/one.png", // Image for the first feature
    },
    {
      title: "Dynamic Video Tools",
      description:
        "Effortlessly upload, download, and delete videos, while leveraging AI to automatically generate topics, summaries, and quizzes. Seamlessly search through topics, and enhance your videos by adding time-stamped notes for a more interactive and insightful viewing experience.",
      imgSrc: "/two.png", // Image for the second feature
    },
    {
      title: "Intelligent Assignment Management",
      description:
        "Harness the power of AI for seamless assignment evaluation, delivering precise feedback and actionable insights to elevate learning outcomes and optimize grading efficiency.",
      imgSrc: "/three.png", // Image for the third feature
    },
    {
      title: "Comprehensive Learning Dashboard",
      description:
        "Design personalized study plans, track performance with detailed analytics, and inspire growth with an engaging leaderboard to foster healthy competition and continuous improvement.",
      imgSrc: "/four.png", // Image for the fourth feature
    },
    {
      title: "Interactive Doubt Resolution",
      description:
        "Ask questions effortlessly, receive prompt answers from instructors, and utilize a smart doubt tracker to monitor and manage all queries for a seamless learning experience.",
      imgSrc: "/five.png", // Image for the fifth feature
    },
  ];

  return (
    <div className="min-h-screen bg-transparent relative">
      <div className="absolute inset-0 z-1">
        <CursorEffect />
      </div>

      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent">
        <div className="flex items-center">
          <img src="/logo_dark.png" alt="Topic Trail Logo" className="h-16" />
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-[#7331AC] rounded hover:bg-[#7331AC] hover:bg-opacity-10"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-white bg-[#7331AC] rounded hover:bg-opacity-90"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main className="pt-24 z-10 relative">
        <div className="text-center">
          <WelcomeText />
          <TypewriterText />
        </div>

        <div className="flex justify-center overflow-x-auto py-8 px-4">
          <div className="flex space-x-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                imgSrc={feature.imgSrc}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
