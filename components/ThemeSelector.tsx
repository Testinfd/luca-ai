import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { themes } from '../services/themeService';
import { ThemeMode } from '../types';

export const ThemeSelector: React.FC = () => {
  const { themeName, setThemeName, themeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter themes to show only themes matching current mode
  const filteredThemes = Object.keys(themes).filter(key => {
    if (themeMode === ThemeMode.SYSTEM) {
      // For system mode, show all themes
      return true;
    }
    // Otherwise only show themes that match the current mode
    return themes[key].mode === themeMode;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md 
                  bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        style={{ backgroundColor: 'var(--color-primary)' }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Open theme selector</span>
        <span className="hidden sm:inline-block">Theme</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {filteredThemes.map((key) => (
              <button
                key={key}
                onClick={() => {
                  setThemeName(key);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  themeName === key ? 'font-medium' : 'font-normal'
                }`}
                style={{ 
                  color: 'var(--color-text)',
                  backgroundColor: themeName === key ? 'var(--color-primary)' : 'transparent',
                  opacity: themeName === key ? 0.2 : 1
                }}
                role="menuitem"
              >
                <span 
                  className="inline-block w-4 h-4 mr-2 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: themes[key].colors.primary }}
                ></span>
                {themes[key].name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 