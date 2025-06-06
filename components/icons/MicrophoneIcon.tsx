import React from 'react';

interface IconProps {
  className?: string;
  isRecording?: boolean;
}

export const MicrophoneIcon: React.FC<IconProps> = ({ className, isRecording }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    <path d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM12 6.75a4.5 4.5 0 014.5 4.5v1.5a4.5 4.5 0 01-9 0v-1.5a4.5 4.5 0 014.5-4.5z" />
    <path d="M3.522 10.498a.75.75 0 00-.437.695A8.25 8.25 0 0011.25 19.5v1.875a.75.75 0 001.5 0V19.5a8.25 8.25 0 008.165-8.307.75.75 0 00-.437-.695A18.683 18.683 0 0012 9.185c-2.786 0-5.433.608-7.812 1.7a.75.75 0 00-.666-.387H3.522z" />
    {isRecording && (
      <circle cx="12" cy="12" r="3" fill="red">
        <animate attributeName="r" from="2" to="4" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0.5" dur="0.8s" repeatCount="indefinite" />
      </circle>
    )}
  </svg>
);