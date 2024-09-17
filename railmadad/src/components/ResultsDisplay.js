import React from 'react';

function ResultsDisplay({ results }) {
  if (!results) {
    return (
      <div className="card p-4 shadow-sm h-100 d-flex justify-content-center align-items-center">
        <p className="text-muted">No results to display. Please submit a form.</p>
      </div>
    );
  }

  return (
    <div className="card p-4 shadow-sm h-100 results-card">
      <h2 className="card-title text-center mb-4">Results</h2>
      <div className="card-body">
        <p><strong>Description:</strong> {results.description}</p>
        <p><strong>Priority:</strong> {results.priority}</p>
        <p><strong>Category:</strong> {results.category}</p>
        <p><strong>Analysis:</strong> {results.analysis}</p>
        <p><strong>Sentiment:</strong> {results.sentiment}</p>
      </div>
    </div>
  );
}

export default ResultsDisplay;
