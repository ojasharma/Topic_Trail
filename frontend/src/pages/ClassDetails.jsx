// In ClassDetails.jsx
import React, { useEffect, useState } from 'react';
import ClassHeader from '../components/ClassHeader';

const ClassDetails = () => {
  const [classCode, setClassCode] = useState('');

  useEffect(() => {
    // Fetch the class code from localStorage
    const storedClassCode = localStorage.getItem('classCode');
    if (storedClassCode) {
      setClassCode(storedClassCode);
    }
  }, []);

  return (
    <div>
      {/* Pass the fetched class code to ClassHeader */}
      <ClassHeader classCode={classCode} />
    </div>
  );
};

export default ClassDetails;
