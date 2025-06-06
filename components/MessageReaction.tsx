import React, { useState } from 'react';

interface MessageReactionProps {
  messageId: string;
  onReaction: (messageId: string, type: string) => void;
}

export const MessageReaction: React.FC<MessageReactionProps> = ({ messageId, onReaction }) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const handleReaction = (type: string) => {
    if (selectedReaction === type) {
      setSelectedReaction(null);
      // If implementing a backend service, you could handle removing reactions here
    } else {
      setSelectedReaction(type);
      onReaction(messageId, type);
    }
  };

  const reactions = [
    { emoji: '👍', type: 'thumbsUp', label: 'Helpful' },
    { emoji: '👎', type: 'thumbsDown', label: 'Not helpful' },
    { emoji: '⭐', type: 'star', label: 'Favorite' },
    { emoji: '🔄', type: 'retry', label: 'Regenerate' },
  ];

  return (
    <div className="flex items-center space-x-1 mt-2">
      {reactions.map(({ emoji, type, label }) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={`p-1 rounded hover:bg-opacity-10 transition-colors ${
            selectedReaction === type ? 'bg-opacity-20' : 'bg-opacity-0'
          }`}
          style={{ 
            backgroundColor: selectedReaction === type ? 'var(--color-primary)' : 'transparent',
          }}
          aria-label={label}
          title={label}
        >
          <span className="text-sm">{emoji}</span>
        </button>
      ))}
    </div>
  );
}; 