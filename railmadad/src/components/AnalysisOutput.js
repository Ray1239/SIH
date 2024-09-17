import React from 'react';

const AnalysisOutput = ({ result }) => (
  <div className="analysis-output p-3">
    <h2>Analysis Results</h2>
    {result ? (
      <div className="results">
        <p><strong>Description:</strong> {result.description}</p>
        <p><strong>Priority:</strong> {result.priority}</p>
        {result.sentiment && <p><strong>Emotion:</strong> {result.sentiment}</p>}
        {result.analysis && <p><strong>Speech to Text:</strong> {result.analysis}</p>}
      </div>
    ) : (
      <p>No results to display. Please submit a file for analysis.</p>
    )}
  </div>
);

export default AnalysisOutput;
