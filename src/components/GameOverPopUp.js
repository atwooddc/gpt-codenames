import React from 'react';

const GameOverPopUp = ({ result, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">{result === 'win' ? 'Congratulations!' : 'Too bad!'}</h2>
        <p>{result === 'win' ? 'You have won the game!' : 'You have lost the game!'}</p>
        <button onClick={onRestart} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Play Again</button>
      </div>
    </div>
  );
};

export default GameOverPopUp;
