import React from 'react';

interface Sentence {
  text: string;
  match_score: number;
}

interface ResultsProps {
  score: number;
  sentencesA: Sentence[];
  sentencesB: Sentence[];
}

const Results: React.FC<ResultsProps> = ({ score, sentencesA, sentencesB }) => {
  const getHighlightColor = (score: number) => {
    // 0% = white, 100% = deep orange
    // rgb(255, 255, 255) to rgb(255, 127, 0)
    const intensity = score;
    if (intensity < 0.1) return 'transparent';

    // We can use tailwind classes for common intensities or inline styles for precise mapping
    // Let's use inline style for match strength
    const alpha = intensity * 0.8; // Max 0.8 alpha for readability
    return `rgba(255, 165, 0, ${alpha})`;
  };

  return (
    <div className="mt-12 space-y-8 animate-in fade-in duration-700">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">Overall Similarity</h2>
        <div className="mt-2 inline-flex items-baseline">
          <span className="text-6xl font-extrabold text-orange-600">{score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Document A</h3>
          <div className="bg-white p-4 border rounded-lg h-[500px] overflow-y-auto leading-relaxed">
            {sentencesA.map((s, i) => (
              <span
                key={i}
                style={{ backgroundColor: getHighlightColor(s.match_score) }}
                className="transition-colors duration-300"
                title={`Match score: ${(s.match_score * 100).toFixed(1)}%`}
              >
                {s.text}{' '}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Document B</h3>
          <div className="bg-white p-4 border rounded-lg h-[500px] overflow-y-auto leading-relaxed">
            {sentencesB.map((s, i) => (
              <span
                key={i}
                style={{ backgroundColor: getHighlightColor(s.match_score) }}
                className="transition-colors duration-300"
                title={`Match score: ${(s.match_score * 100).toFixed(1)}%`}
              >
                {s.text}{' '}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
