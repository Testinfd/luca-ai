import React from 'react';
import { ChatMessage as ChatMessageType, MessageSender } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';
import { LoadingSpinner } from './LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MessageReaction } from './MessageReaction';


interface ChatMessageProps {
  message: ChatMessageType;
  typingIndicatorText: string;
  imageAltText: string; // For accessibility of user-uploaded images
  onReaction?: (messageId: string, type: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  typingIndicatorText, 
  imageAltText,
  onReaction 
}) => {
  const { id, text, sender, timestamp, isStreaming, error, image } = message;

  const isUser = sender === MessageSender.USER;
  const isSystem = sender === MessageSender.SYSTEM;
  const isAI = sender === MessageSender.AI;

  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const messageAlignment = isUser ? 'justify-end' : 'justify-start';
  
  // Using CSS variables for theming
  let bubbleClasses = 'px-4 py-3 shadow-lg chat-message';
  let iconClasses = 'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md';
  let timestampClasses = 'text-xs mt-1';
  
  if (isUser) {
    bubbleClasses += ' chat-message user rounded-l-xl rounded-tr-xl';
    iconClasses += ' ml-2';
    timestampClasses += ' text-left';
  } else if (isSystem) {
    bubbleClasses += ' chat-message system rounded-xl';
    timestampClasses += ' text-right';
    if (error) {
      bubbleClasses += ' bg-opacity-80';
    }
  } else { // AI message
    bubbleClasses += ' chat-message ai rounded-r-xl rounded-tl-xl';
    iconClasses += ' mr-2';
    timestampClasses += ' text-right';
  }

  const IconToRender = isUser ? UserIcon : BotIcon;
  const iconColorClass = isUser ? 'text-white' : 'text-slate-50';

  return (
    <div className={`flex ${messageAlignment} mb-4 animate-fadeIn`}>
      <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isSystem && (
          <div className={iconClasses} style={{ backgroundColor: isUser ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
             <IconToRender className={`w-5 h-5 ${iconColorClass}`} />
          </div>
        )}
        <div className={bubbleClasses}>
          {isSystem ? (
            <p className={`text-sm ${error ? 'font-semibold' : ''}`}>{text}</p>
          ) : (
            <>
              {image?.dataUrl && isUser && (
                <div className="mb-2 rounded-lg overflow-hidden">
                  <img 
                    src={image.dataUrl} 
                    alt={image.name || imageAltText} 
                    className="max-w-full h-auto max-h-60 object-contain" 
                  />
                </div>
              )}
              {text.trim() && (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                      a: ({node, ...props}) => (
                        <a 
                          style={{ color: 'var(--color-primary)' }}
                          className="underline hover:opacity-80" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          {...props} 
                        />
                      ),
                      code: ({node, className, children, ...props}) => {
                        const hasLineBreak = children?.toString().includes('\n');
                        return hasLineBreak
                          ? <code className="block p-2 rounded text-sm" style={{ backgroundColor: 'rgba(var(--color-surface), 0.8)' }} {...props} />
                          : <code className="px-1 py-0.5 rounded text-sm" style={{ backgroundColor: 'rgba(var(--color-accent-rgb), 0.1)' }} {...props} />;
                      },
                      pre: ({node, ...props}) => (
                        <pre 
                          className="p-3 rounded-md overflow-x-auto" 
                          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-primary)' }}
                          {...props} 
                        />
                      )
                    }}
                  >
                    {text}
                  </ReactMarkdown>
                </div>
              )}
            </>
          )}
          {isStreaming && !isSystem && (
            <div className="mt-2 flex items-center justify-start">
              <LoadingSpinner size="sm" color="text-pink-400" /> 
              <span className="ml-2 text-xs opacity-75">{typingIndicatorText}</span>
            </div>
          )}
          <div className={timestampClasses} style={{ color: 'var(--color-textSecondary)' }}>
            {timeString}
          </div>
          
          {/* Add message reactions for AI messages only */}
          {isAI && !isStreaming && onReaction && (
            <MessageReaction messageId={id} onReaction={onReaction} />
          )}
        </div>
      </div>
    </div>
  );
};

// Ensure fadeIn animation is only added once
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    let fadeInExists = false;
    try {
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule instanceof CSSKeyframesRule && rule.name === 'fadeIn') {
          fadeInExists = true;
          break;
        }
      }
    } catch (e) {
      // console.warn("Error accessing CSS rules (potentially cross-origin):", e);
    }

    if (!fadeInExists) {
      const keyframes =
      `@keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }`;
      const animationClass = `.animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }`;
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        styleSheet.insertRule(animationClass, styleSheet.cssRules.length);
      } catch (e) {
        // console.warn("Could not insert fadeIn CSS rules:", e);
        const styleEl = document.createElement('style');
        document.head.appendChild(styleEl);
        if (styleEl.sheet) {
            styleEl.sheet.insertRule(keyframes, 0);
            styleEl.sheet.insertRule(animationClass, 1);
        }
      }
    }
  }
}
