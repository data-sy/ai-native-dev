import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-center md:text-left">
          <p>&copy; 2024 My Awesome Site. All rights reserved.</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md">
          문의하기
        </button>
      </div>
    </footer>
  );
};

export default Footer;
