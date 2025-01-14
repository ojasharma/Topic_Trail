import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteAccountSection = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Base URL from environment variables
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${baseUrl}/api/users/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear JWT from localStorage
        localStorage.removeItem("jwt");
        // Navigate to home page
        navigate("/");
      } else {
        alert(data.message || "Error deleting account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Delete Account
        </h3>
        <p className="text-red-600 mb-4">
          This action cannot be undone. This will permanently delete your
          account, all your created classes, and associated content.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Account
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">
                Are you absolutely sure?
              </h3>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers, including:
              </p>
              <ul className="list-disc ml-6 mb-6 text-gray-600">
                <li>Your profile information</li>
                <li>All classes you've created</li>
                <li>All uploaded videos and content</li>
                <li>Your membership in other classes</li>
              </ul>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Yes, delete my account"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountSection;
