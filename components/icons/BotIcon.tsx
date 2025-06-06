
import React from 'react';

interface IconProps {
  className?: string;
}

export const BotIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm8.25.75a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm.75 2.25a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zM8.625 15a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zM11.25 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" clipRule="evenodd" />
    <path d="M12.75 18.75a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75z"/> {/* Added a small detail to the mouth area */}
  </svg>
);
