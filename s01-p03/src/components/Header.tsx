import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="text-xl font-bold text-gray-800">
        My Awesome Site
      </div>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        가입하기
      </button>
    </header>
  );
}
