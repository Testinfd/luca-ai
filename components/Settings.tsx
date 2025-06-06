import React, { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeSelector } from './ThemeSelector';
import { ThemeMode } from '../types';
import { useTheme } from './ThemeProvider';

interface SettingsProps {
  exportMessages: () => void;
  clearConversation: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ exportMessages, clearConversation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { themeMode, setThemeMode } = useTheme();

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={settingsRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        aria-label="Settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 rounded-md shadow-lg z-10 py-2"
          style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        >
          <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--color-primary)' }}>
            <h3 className="text-sm font-medium">Settings</h3>
          </div>
          
          <div className="px-4 py-3">
            <h4 className="text-xs font-medium uppercase tracking-wider mb-2">Appearance</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <ThemeSelector />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Mode</span>
                <div className="flex space-x-2">
                  <select
                    value={themeMode}
                    onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
                    className="text-sm rounded-md"
                    style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                  >
                    <option value={ThemeMode.LIGHT}>Light</option>
                    <option value={ThemeMode.DARK}>Dark</option>
                    <option value={ThemeMode.SYSTEM}>System</option>
                  </select>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-primary)' }}>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-2">Actions</h4>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  exportMessages();
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-opacity-10"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)', opacity: 0.9 }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Conversation
              </button>
              
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear the conversation? This cannot be undone.')) {
                    clearConversation();
                    setIsOpen(false);
                  }
                }}
                className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-opacity-10"
                style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-text)', opacity: 0.9 }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 