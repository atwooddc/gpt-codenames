import React from 'react';

const RoleSelectionPopUp = ({ onSelectRole }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="bg-white p-8 rounded shadow-lg text-center">
      {/* <h2 className="text-2xl font-bold mb-4">Select Your Role</h2> */}
      <h2 className="text-2xl font-bold mb-4">Currently, you may only play as Spymaster</h2>
      <button disabled className="mt-2 px-4 py-2 text-slate-300 bg-slate-100 rounded" onClick={() => onSelectRole('guesser')}>
        Field Operative (Guesser)
      </button>
      <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded" onClick={() => onSelectRole('spymaster')}>
        Spymaster (Clue Giver)
      </button>
    </div>
  </div>
);

export default RoleSelectionPopUp;
