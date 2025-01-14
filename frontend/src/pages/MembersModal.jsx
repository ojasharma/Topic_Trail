import React from 'react';
import { X } from 'lucide-react';

const MembersModal = ({ isOpen, onClose, members, classId, isCreator, onRemoveMember }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Class Members</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex justify-between items-center p-3 border-b dark:border-gray-700"
            >
              <div className="dark:text-white">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
              </div>
              {isCreator && member._id !== members[0]._id && (
                <button
                  onClick={() => onRemoveMember(classId, member._id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:text-red-400 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersModal;