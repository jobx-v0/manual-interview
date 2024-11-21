import React, { useState } from "react";

interface Scores {
  communication_skills: number;
  subject_expertise: number;
  relevancy: number;
}

const EngagementScore = () => {
  const [scores, setScores] = useState<Scores>({
    communication_skills: 0,
    subject_expertise: 0,
    relevancy: 0,
  });

  const handleRating = (category: keyof Scores, value: number) => {
    setScores((prevScores) => ({
      ...prevScores,
      [category]: value,
    }));
  };

  const renderStars = (category: keyof Scores, currentValue: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(category, star)}
            className={`text-2xl ${
              star <= currentValue ? "text-yellow-400" : "text-gray-300"
            }`}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <h4 className="font-bold mb-4 text-2xl">Engagement Score</h4>

      {/* Communication Skills */}
      <div className="mb-4">
        <h5 className="font-medium">Communication Skills</h5>
        {renderStars("communication_skills", scores.communication_skills)}
      </div>

      {/* Subject Expertise */}
      <div className="mb-4">
        <h5 className="font-medium">Subject Expertise</h5>
        {renderStars("subject_expertise", scores.subject_expertise)}
      </div>

      {/* Relevancy */}
      <div>
        <h5 className="font-medium">Relevancy</h5>
        {renderStars("relevancy", scores.relevancy)}
      </div>
    </>
  );
};

export default EngagementScore;
