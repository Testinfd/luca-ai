import React, { useState, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage as ChatMessageType, MessageSender, Language, ImagePart, ChatInputTranslations } from './types';
import { ChatInput } from './components/ChatInput';
import { ChatWindow } from './components/ChatWindow';
import { initializeChatSession, sendMessageToAI } from './services/geminiService';
import { translations } from './translations';
import { BotIcon } from './components/icons/BotIcon';
import { ThemeProvider } from './components/ThemeProvider';
import { Settings } from './components/Settings';
import { ThemeToggle } from './components/ThemeToggle';
import './theme.css';
import 'katex/dist/katex.min.css';

// Helper function to convert File to ImagePart and data URL for preview
const processImageFile = async (file: File): Promise<{ imagePart: ImagePart; dataUrl: string }> => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  // Extract base64 data for Gemini API
  const base64Data = dataUrl.split(',')[1];
  return {
    imagePart: { mimeType: file.type, data: base64Data },
    dataUrl,
  };
};


const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.EN);
  const apiKey = import.meta.env.VITE_API_KEY;

  const currentTranslations = translations[currentLanguage];

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.title = currentTranslations.appName;
  }, [currentLanguage, currentTranslations.appName]);

  const initializeChat = useCallback(async () => {
    if (!apiKey) {
      setError(currentTranslations.apiKeyError);
      setMessages([{
        id: 'init-error',
        text: currentTranslations.apiKeyError,
        sender: MessageSender.SYSTEM,
        timestamp: new Date(),
        error: true,
      }]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const session = initializeChatSession(apiKey, currentTranslations.systemInstruction);
      setChatSession(session);
      setMessages([{
        id: 'greeting',
        text: currentTranslations.greeting, // Greeting now mentions voice input
        sender: MessageSender.AI,
        timestamp: new Date(),
      }]);
    } catch (e) {
      console.error("Failed to initialize chat session:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
      setError(`${currentTranslations.initializationFailed}${errorMessage}`);
      setMessages([{
        id: 'init-fail',
        text: `${currentTranslations.initializationFailed}${errorMessage}`,
        sender: MessageSender.SYSTEM,
        timestamp: new Date(),
        error: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, currentLanguage, currentTranslations]); 

  useEffect(() => {
    initializeChat();
  }, [initializeChat]); 


  const handleSendMessage = useCallback(async (inputText: string, imageFile?: File) => {
    if ((!inputText.trim() && !imageFile) || isLoading || !chatSession) {
      if (!chatSession && apiKey) {
        setError(currentTranslations.chatInitializationError);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    let imageForUserMessage: ChatMessageType['image'] | undefined = undefined;
    let imageForAIService: ImagePart | undefined = undefined;

    if (imageFile) {
      try {
        const { imagePart, dataUrl } = await processImageFile(imageFile);
        imageForAIService = imagePart;
        imageForUserMessage = { dataUrl, name: imageFile.name };
      } catch (e) {
        console.error("Error processing image:", e);
        setError(currentTranslations.imageUploadError);
        setMessages(prev => [...prev, {
          id: `img-err-${Date.now()}`,
          text: currentTranslations.imageUploadError + (e instanceof Error ? ` ${e.message}`: ''),
          sender: MessageSender.SYSTEM,
          timestamp: new Date(),
          error: true,
        }]);
        setIsLoading(false);
        return;
      }
    }
    
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: MessageSender.USER,
      timestamp: new Date(),
      image: imageForUserMessage,
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    const aiMessageId = `ai-${Date.now()}`;
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: aiMessageId,
        text: '',
        sender: MessageSender.AI,
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    try {
      const stream = await sendMessageToAI(chatSession, inputText, imageForAIService);
      let currentAiText = '';
      for await (const chunk of stream) {
        currentAiText += chunk;
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: currentAiText, isStreaming: true } : msg
          )
        );
      }
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (e) {
      console.error("Error sending message to AI:", e);
      const errText = e instanceof Error ? e.message : "An unknown error occurred.";
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: `${currentTranslations.aiResponseError}${errText}`, isStreaming: false, error: true } : msg
        )
      );
      setError(`${currentTranslations.aiResponseError}${errText}`);
    } finally {
      setIsLoading(false);
    }
  }, [chatSession, isLoading, apiKey, currentTranslations]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
  };
  
  const chatInputTranslations: ChatInputTranslations = {
    inputPlaceholder: currentTranslations.inputPlaceholder,
    inputPlaceholderLoading: currentTranslations.inputPlaceholderLoading,
    sendButton: currentTranslations.sendButton,
    attachImageButtonLabel: currentTranslations.attachImageButtonLabel,
    imagePreviewLabel: currentTranslations.imagePreviewLabel,
    removeImageButtonLabel: currentTranslations.removeImageButtonLabel,
    imageUploadError: currentTranslations.imageUploadError,
    speechToTextButtonLabelStart: currentTranslations.speechToTextButtonLabelStart,
    speechToTextButtonLabelStop: currentTranslations.speechToTextButtonLabelStop,
    speechRecognitionNotSupported: currentTranslations.speechRecognitionNotSupported,
    microphonePermissionDenied: currentTranslations.microphonePermissionDenied,
    speechRecognitionError: currentTranslations.speechRecognitionError,
    noSpeechDetected: currentTranslations.noSpeechDetected,
  };

  // Handle message reactions
  const handleMessageReaction = useCallback((messageId: string, type: string) => {
    console.log(`Reaction ${type} on message ${messageId}`);
    
    if (type === 'retry' && chatSession) {
      // Find the message to regenerate
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) return;
      
      // Find the previous user message to use as input
      let userMessageIndex = messageIndex - 1;
      while (userMessageIndex >= 0 && messages[userMessageIndex].sender !== MessageSender.USER) {
        userMessageIndex--;
      }
      
      if (userMessageIndex >= 0) {
        const userMessage = messages[userMessageIndex];
        // Re-send the user message to generate a new response
        handleSendMessage(userMessage.text, userMessage.image ? new File(
          [Buffer.from(userMessage.image.dataUrl.split(',')[1], 'base64')], 
          userMessage.image.name || 'image.jpg', 
          { type: userMessage.image.dataUrl.split(';')[0].split(':')[1] }
        ) : undefined);
      }
    }
  }, [messages, chatSession, handleSendMessage]);

  // Export conversation as JSON
  const exportConversation = useCallback(() => {
    const conversationData = {
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString(),
        error: msg.error || false,
        // Don't include the image data to keep the export smaller
        hasImage: !!msg.image
      }))
    };
    
    const dataStr = JSON.stringify(conversationData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `luca-chat-${new Date().toISOString().replace(/:/g, '-')}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${exportName}.json`);
    linkElement.click();
  }, [messages]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    // Keep only the greeting message if it exists
    const greeting = messages.find(m => m.id === 'greeting');
    setMessages(greeting ? [greeting] : []);
    
    // Re-initialize the chat session
    if (apiKey) {
      const session = initializeChatSession(apiKey, currentTranslations.systemInstruction);
      setChatSession(session);
    }
  }, [messages, apiKey, currentTranslations.systemInstruction]);

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
        <header 
          className="p-4 sm:p-6 shadow-lg flex items-center justify-between" 
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'white'
          }}
        >
          <div className="flex items-center space-x-3">
            <BotIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            <h1 className="text-xl sm:text-2xl font-bold">{currentTranslations.headerTitle}</h1>
          </div>
          <div className="flex items-center space-x-2">
            {(Object.keys(Language) as Array<keyof typeof Language>).map((langKey) => {
              const langValue = Language[langKey];
              const buttonText = langValue === Language.EN 
                ? translations[Language.EN].langEnglish 
                : translations[Language.HI].langHindi;
              return (
                <button
                  key={langValue}
                  onClick={() => handleLanguageChange(langValue)}
                  className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors
                    ${currentLanguage === langValue 
                      ? 'bg-white text-primary shadow-md' 
                      : 'bg-opacity-20 hover:bg-opacity-30 text-white'}`}
                  style={{ 
                    backgroundColor: currentLanguage === langValue ? 'white' : 'rgba(255, 255, 255, 0.2)',
                    color: currentLanguage === langValue ? 'var(--color-primary)' : 'white'
                  }}
                  aria-pressed={currentLanguage === langValue}
                >
                  {buttonText}
                </button>
              );
            })}
            <ThemeToggle />
            <Settings 
              exportMessages={exportConversation} 
              clearConversation={clearConversation} 
            />
          </div>
        </header>
        
        {error && !messages.find(m => m.error && m.sender === MessageSender.SYSTEM && m.text.includes(error)) && (
           <div 
             className="p-3 text-white border-b text-sm" 
             style={{ backgroundColor: 'var(--color-error)' }}
           >
             <strong className="font-semibold">{currentTranslations.errorMessageTitle}</strong> {error}
           </div>
        )}

        <ChatWindow 
          messages={messages} 
          isLoading={isLoading && messages.length <=1 } 
          loadingText={currentTranslations.loadingChat}
          typingIndicatorText={currentTranslations.typingIndicator}
          imageAltText={currentTranslations.imageAltText}
          onMessageReaction={handleMessageReaction}
        />
        
        <div className="p-3 sm:p-4 border-t" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-surface)' }}>
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading || !chatSession || !apiKey}
            translations={chatInputTranslations}
            currentLanguage={currentLanguage}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;