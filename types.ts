export enum MessageSender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
  image?: {
    dataUrl: string; // base64 data URL for display
    name?: string;    // optional file name
  };
}

export enum Language {
  EN = 'en',
  HI = 'hi',
}

export interface ImagePart {
  mimeType: string;
  data: string; // base64 encoded string without prefix
}

export interface Translations {
  appName: string;
  headerTitle: string;
  inputPlaceholder: string;
  inputPlaceholderLoading: string;
  sendButton: string;
  errorMessageTitle: string;
  typingIndicator: string;
  loadingChat: string;
  greeting: string;
  systemInstruction: string;
  apiKeyError: string;
  initializationFailed: string;
  chatInitializationError: string;
  aiResponseError: string;
  langEnglish: string;
  langHindi: string;
  attachImageButtonLabel: string;
  imagePreviewLabel: string;
  removeImageButtonLabel: string;
  imageAltText: string;
  imageUploadError: string;
  // Speech-to-text
  speechToTextButtonLabelStart: string;
  speechToTextButtonLabelStop: string;
  speechRecognitionNotSupported: string;
  microphonePermissionDenied: string;
  speechRecognitionError: string;
  noSpeechDetected: string;
}

export type TranslationKeys = keyof Translations;

export interface ChatInputTranslations extends Pick<Translations, 
  'inputPlaceholder' | 
  'inputPlaceholderLoading' | 
  'sendButton' | 
  'attachImageButtonLabel' | 
  'imagePreviewLabel' | 
  'removeImageButtonLabel' | 
  'imageUploadError' |
  'speechToTextButtonLabelStart' |
  'speechToTextButtonLabelStop' |
  'speechRecognitionNotSupported' |
  'microphonePermissionDenied' |
  'speechRecognitionError' |
  'noSpeechDetected'
> {}

// Global augmentations for Web Speech API
declare global {
  interface SpeechRecognitionEventMap {
    "audiostart": Event;
    "audioend": Event;
    "end": Event;
    "error": SpeechRecognitionErrorEvent;
    "nomatch": SpeechRecognitionEvent;
    "result": SpeechRecognitionEvent;
    "soundstart": Event;
    "soundend": Event;
    "speechstart": Event;
    "speechend": Event;
    "start": Event;
  }

  interface SpeechRecognition extends EventTarget {
    grammars: any; // Can be SpeechGrammarList if defined/needed
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI?: string;

    start(): void;
    stop(): void;
    abort(): void;

    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

    addEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }

  interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
    readonly interpretation?: any;
    readonly emma?: any;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  name: string;
}
