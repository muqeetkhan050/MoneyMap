import React, { useState } from 'react';
import './Header.css';

function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <h1>MoneyMap</h1>
        </div>

        {/* Center Navigation with Dropdowns */}
        <nav className="nav-center">
          {/* Features Dropdown */}
          <div className="dropdown">
            <button 
              className="nav-dropdown"
              onClick={() => toggleDropdown('features')}
            >
              Features
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {openDropdown === 'features' && (
              <div className="dropdown-menu">
                <a href="#budget" className="dropdown-item">Budget Tracking</a>
                <a href="#expense" className="dropdown-item">Expense Analysis</a>
                <a href="#goals" className="dropdown-item">Goals</a>
                <a href="#reports" className="dropdown-item">Reports</a>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="dropdown">
            <button 
              className="nav-dropdown"
              onClick={() => toggleDropdown('resources')}
            >
              Resources
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {openDropdown === 'resources' && (
              <div className="dropdown-menu">
                <a href="#docs" className="dropdown-item">Documentation</a>
                <a href="#tutorials" className="dropdown-item">Tutorials</a>
                <a href="#blog" className="dropdown-item">Blog</a>
                <a href="#support" className="dropdown-item">Support</a>
              </div>
            )}
          </div>

          {/* Company Dropdown */}
          <div className="dropdown">
            <button 
              className="nav-dropdown"
              onClick={() => toggleDropdown('company')}
            >
              Company
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {openDropdown === 'company' && (
              <div className="dropdown-menu">
                <a href="#about" className="dropdown-item">About</a>
                <a href="#careers" className="dropdown-item">Careers</a>
                <a href="#contact" className="dropdown-item">Contact</a>
              </div>
            )}
          </div>
        </nav>

        {/* Right side - empty for now */}
        <div className="header-right"></div>
      </div>
    </header>
  );
}

export default Header;