import React from 'react';

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <nav className="p-4 flex justify-between items-center max-w-7xl mx-auto">
        <ul className="flex space-x-6">
          <li>
            <a
              href="#home"
              className="hover:text-yellow-400 transition-colors"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#portfolio"
              className="hover:text-yellow-400 transition-colors"
            >
              Portfolio
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="hover:text-yellow-400 transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
