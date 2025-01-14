import React, { useState } from "react";
import { FaClipboard } from "react-icons/fa";

const AssignmentForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assignment Form Submitted with question:", question); // Log form submission
    onSubmit({ question });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Assignment Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded h-24 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
          placeholder="Enter the assignment question..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Save Assignment
      </button>
    </form>
  );
};

const AssignmentSubmission = ({ onSubmit }) => {
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      console.log("No image selected for submission"); // Log when no image is selected
      return;
    }

    console.log("Submitting assignment with image:", image); // Log image details
    const formData = new FormData();
    formData.append("image", image);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Upload Your Solution
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            console.log("File selected:", e.target.files[0]); // Log file details
            setImage(e.target.files[0]);
          }}
          className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Submit Assignment
      </button>
    </form>
  );
};

const AssignmentView = ({ assignment, submissions, isCreator, onSubmit }) => {
  console.log("Rendering AssignmentView with props:", {
    assignment,
    submissions,
    isCreator,
  }); // Log props

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
          Assignment
        </h4>
        <p className="text-gray-700 dark:text-gray-300">
          {assignment?.question || "No assignment available"}{" "}
          {/* Handle undefined assignment */}
        </p>
      </div>

      {!isCreator && (
        <>
          <p className="text-gray-600 dark:text-gray-400">
            You are not the creator. Submitting an assignment:
          </p>
          <AssignmentSubmission onSubmit={onSubmit} />
        </>
      )}

      {isCreator && submissions?.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Submissions
          </h4>
          {submissions.map((submission, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Submitted by: {submission.userId}
              </p>
              <img
                src={submission.imageUrl}
                alt="Assignment submission"
                className="w-full rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { AssignmentForm, AssignmentView };
