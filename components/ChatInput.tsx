
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { ChatInputTranslations, Language } from '../types';

interface ChatInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  isLoading: boolean;
  translations: ChatInputTranslations;
  currentLanguage: Language; // For speech recognition lang
}

// Use a different name for the constructor to avoid conflict with the global SpeechRecognition interface type
const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  translations,
  currentLanguage
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  // Explicitly type the ref with the global SpeechRecognition interface
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const [speechAPISupported, setSpeechAPISupported] = useState(true);


  useEffect(() => {
    if (!SpeechRecognitionConstructor) {
      setSpeechAPISupported(false);
      setSpeechError(translations.speechRecognitionNotSupported);
      return;
    }

    // Type annotation for 'recognition' is the global SpeechRecognition interface
    const recognition: SpeechRecognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = true; 
    
    const langMap: Record<Language, string> = {
      [Language.EN]: 'en-US',
      [Language.HI]: 'hi-IN',
    };
    recognition.lang = langMap[currentLanguage];

    recognition.onstart = () => {
      setIsRecording(true);
      setSpeechError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => { // event is now correctly typed
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputText(prev => prev ? prev + ' ' + finalTranscript.trim() : finalTranscript.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => { // event is now correctly typed
      setIsRecording(false);
      if (event.error === 'no-speech') {
        setSpeechError(translations.noSpeechDetected);
      } else if (event.error === 'audio-capture') {
        setSpeechError(translations.microphonePermissionDenied); 
      } else if (event.error === 'not-allowed') {
        setSpeechError(translations.microphonePermissionDenied);
      } else {
        setSpeechError(`${translations.speechRecognitionError} ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
    
    speechRecognitionRef.current = recognition;

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, [currentLanguage, translations]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setImageError(translations.imageUploadError + " (Max 5MB)");
        setSelectedImage(null);
        setImagePreviewUrl(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setImageError(translations.imageUploadError + " (Image files only)");
        setSelectedImage(null);
        setImagePreviewUrl(null);
        return;
      }
      setSelectedImage(file);
      setImageError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToggleRecording = () => {
    if (!speechAPISupported || !speechRecognitionRef.current) {
      setSpeechError(translations.speechRecognitionNotSupported)
      return;
    }
    if (isRecording) {
      speechRecognitionRef.current.stop();
    } else {
      setSpeechError(null); 
      try {
         speechRecognitionRef.current.start();
      } catch(e) {
        console.error("Error starting speech recognition:", e);
        setSpeechError(translations.speechRecognitionError + (e instanceof Error ? e.message : String(e)));
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputText.trim() || selectedImage) && !isLoading) {
      onSendMessage(inputText, selectedImage || undefined);
      setInputText('');
      handleRemoveImage();
      setSpeechError(null);
    }
  };

  const commonButtonClasses = "p-3 border border-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const iconButtonColor = "text-indigo-300 hover:text-white";

  return (
    <div className="flex flex-col">
      {(imageError || speechError) && (
        <div className="mb-2 text-sm text-red-300 bg-red-900 p-2 rounded-md border border-red-700">
          {imageError && <p>🖼️ {imageError}</p>}
          {speechError && <p>🎤 {speechError}</p>}
        </div>
      )}
      {imagePreviewUrl && selectedImage && (
        <div className="mb-2 p-2 border border-indigo-600 rounded-lg bg-indigo-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={imagePreviewUrl} alt={selectedImage.name || translations.imagePreviewLabel} className="h-16 w-16 object-cover rounded border-2 border-indigo-500" />
              <div>
                <p className="text-sm font-medium text-indigo-200">{translations.imagePreviewLabel}</p>
                <p className="text-xs text-indigo-400 truncate max-w-xs">{selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-indigo-300 hover:text-red-400 transition-colors text-lg p-1 rounded-full hover:bg-red-700"
              aria-label={translations.removeImageButtonLabel}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="imageUpload"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={commonButtonClasses}
          aria-label={translations.attachImageButtonLabel}
        >
          <PaperclipIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconButtonColor}`} />
        </button>
         <button
          type="button"
          onClick={handleToggleRecording}
          disabled={isLoading || !speechAPISupported}
          className={`${commonButtonClasses} ${isRecording ? 'bg-red-700 !border-red-500 hover:bg-red-600' : ''}`}
          aria-label={isRecording ? translations.speechToTextButtonLabelStop : translations.speechToTextButtonLabelStart}
        >
          <MicrophoneIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${isRecording ? 'text-white' : iconButtonColor}`} isRecording={isRecording} />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isLoading ? translations.inputPlaceholderLoading : translations.inputPlaceholder}
          className="flex-grow p-3 bg-indigo-700 border border-indigo-600 text-indigo-100 placeholder-indigo-400 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-150 ease-in-out text-sm sm:text-base disabled:bg-indigo-800 disabled:cursor-not-allowed"
          disabled={isLoading}
          aria-label={translations.inputPlaceholder}
        />
        <button
          type="submit"
          disabled={isLoading || (!inputText.trim() && !selectedImage)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold p-3 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-indigo-800 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label={translations.sendButton}
        >
          <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sr-only">{translations.sendButton}</span>
        </button>
      </form>
    </div>
  );
};
