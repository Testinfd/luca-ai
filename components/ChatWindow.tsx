import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';
import { LoadingSpinner } from './LoadingSpinner';

interface ChatWindowProps {
  messages: ChatMessageType[];
  isLoading: boolean; // Specifically for the initial loading of the chat window
  loadingText: string;
  typingIndicatorText: string;
  imageAltText: string;
  onMessageReaction?: (messageId: string, type: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  isLoading, 
  loadingText, 
  typingIndicatorText,
  imageAltText,
  onMessageReaction
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
        <LoadingSpinner size="lg" color="text-pink-400" />
        <p className="mt-4 text-lg">{loadingText}</p>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto" style={{ backgroundColor: 'var(--color-background)' }}>
      {messages.map((msg) => (
        <ChatMessage 
          key={msg.id} 
          message={msg} 
          typingIndicatorText={typingIndicatorText}
          imageAltText={imageAltText}
          onReaction={onMessageReaction}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
