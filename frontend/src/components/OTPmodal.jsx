import React, { useState, useEffect } from "react";

const OTPModal = ({ isOpen, onClose, email, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value && index < 5) {
      const nextInput =
        element.parentElement.nextSibling?.querySelector("input");
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput =
        e.target.parentElement.previousSibling?.querySelector("input");
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const otpString = otp.join("");
    try {
      await onVerify(otpString);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">
          Verify Your Email
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Enter the verification code sent to
          <br />
          <span className="font-medium">{email}</span>
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <div key={index} className="w-12">
              <input
                type="text"
                maxLength="1"
                className="w-full h-12 text-center text-xl font-semibold border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          ))}
        </div>

        <p className="text-center mb-4 text-gray-500 dark:text-gray-400">
          Time remaining: {formatTime(timer)}
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading || otp.some((digit) => !digit) || timer === 0}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          Didn't receive the code?{" "}
          <button
            className="text-purple-600 hover:text-purple-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={() => {
              // Add resend OTP logic here
              setTimer(600);
            }}
            disabled={timer > 0}
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
