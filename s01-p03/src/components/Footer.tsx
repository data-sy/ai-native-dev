import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-center md:text-left">
          <p>&copy; 2024 My Awesome Site. All rights reserved.</p>
        </div>

        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200">
          문의하기
        </button>
      </div>
    </footer>
  );
}
