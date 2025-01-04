import { useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from "react-icons/fa";

const EditableSummary = ({ summary, videoId, onSummaryUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summary);
  const [originalSummary, setOriginalSummary] = useState(summary);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const handleEdit = () => {
    setOriginalSummary(summary);
    setEditedSummary([...summary]);
    setIsEditing(true);
  };

  const handleUpdateTopic = (index, field, value) => {
    const newSummary = [...editedSummary];
    newSummary[index] = { ...newSummary[index], [field]: value };
    setEditedSummary(newSummary);
  };

  const handleDeleteTopic = async (topicId, index) => {
    if (isEditing) {
      // Local delete during edit mode
      const newSummary = editedSummary.filter((_, i) => i !== index);
      setEditedSummary(newSummary);
    } else {
      // Direct delete in view mode
      try {
        const response = await fetch(
          `${baseUrl}videos/${videoId}/summary/${topicId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          onSummaryUpdate(result.summary);
        }
      } catch (error) {
        toast.error("Failed to delete topic");
      }
    }
  };

  const handleAddTopic = () => {
    setEditedSummary([
      ...editedSummary,
      { title: "New Topic", content: "Enter content here" },
    ]);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${baseUrl}videos/${videoId}/summary`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ summary: editedSummary }),
      });

      if (response.ok) {
        const result = await response.json();
        onSummaryUpdate(result.summary);
        setIsEditing(false);
        toast.success("Summary updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update summary");
    }
  };

  const handleDiscard = () => {
    setEditedSummary(originalSummary);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Summary
        </h3>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaSave className="mr-1" /> Save
              </button>
              <button
                onClick={handleDiscard}
                className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="mr-1" /> Discard
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FaEdit className="mr-1" /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {(isEditing ? editedSummary : summary).map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg transition-all"
          >
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleUpdateTopic(index, "title", e.target.value)
                  }
                  className="w-full mb-2 p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
                <textarea
                  value={item.content}
                  onChange={(e) =>
                    handleUpdateTopic(index, "content", e.target.value)
                  }
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                  rows="3"
                />
              </>
            ) : (
              <>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {item.content}
                </p>
              </>
            )}

            <div className="mt-2 flex justify-end">
              <button
                onClick={() => handleDeleteTopic(item._id, index)}
                className="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <button
          onClick={handleAddTopic}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> Add New Topic
        </button>
      )}
    </div>
  );
};

export default EditableSummary;
