import React from 'react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-red-300 text-lg font-semibold mb-2">
        Eroare la încărcarea datelor
      </h3>
      <p className="text-red-200 mb-4 text-sm">
        {error || 'A apărut o eroare neașteptată'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Încearcă din nou
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;