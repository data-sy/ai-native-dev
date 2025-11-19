import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="text-xl font-bold text-gray-800">
        My Awesome Site
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md">
        가입하기
      </button>
    </header>
  );
};

export default Header;
