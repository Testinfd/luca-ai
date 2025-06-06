import { Language, Translations } from './types';

export const translations: Record<Language, Translations> = {
  [Language.EN]: {
    appName: "Luca AI",
    headerTitle: "Luca AI Study Assistant",
    inputPlaceholder: "Ask Luca AI anything or attach an image...",
    inputPlaceholderLoading: "Luca AI is thinking...",
    sendButton: "Send",
    errorMessageTitle: "Error:",
    typingIndicator: "Luca is typing...",
    loadingChat: "Loading chat...",
    greeting: "Hello! I'm Luca AI. How can I help you with your studies today? You can also ask questions about an image or use the microphone to ask.",
    systemInstruction: `You are Luca AI, a friendly and knowledgeable study assistant.
Your primary goal is to help students with their academic questions, including those related to images they provide or questions asked via voice.
Provide clear, concise, and accurate explanations in English.
If a question is ambiguous, ask for clarification.
If a question is outside of academic topics, politely state your focus on study-related assistance.
Format your answers clearly, using markdown for lists, bolding, or italics where appropriate to improve readability.
If you are unsure about an answer, state that you are unsure rather than providing potentially incorrect information.
When an image is provided with a question, analyze the image in context of the question.`,
    apiKeyError: "Critical Error: API Key is missing. This application cannot function without it.",
    initializationFailed: "Failed to initialize AI service: ",
    chatInitializationError: "Chat session is not initialized. Cannot send message.",
    aiResponseError: "Failed to get response from AI: ",
    langEnglish: "English",
    langHindi: "हिन्दी",
    attachImageButtonLabel: "Attach Image",
    imagePreviewLabel: "Image:",
    removeImageButtonLabel: "Remove",
    imageAltText: "User uploaded image",
    imageUploadError: "Failed to load image. Please try a different one.",
    speechToTextButtonLabelStart: "Start voice input",
    speechToTextButtonLabelStop: "Stop voice input",
    speechRecognitionNotSupported: "Speech recognition is not supported by your browser.",
    microphonePermissionDenied: "Microphone permission denied. Please enable it in your browser settings.",
    speechRecognitionError: "Speech recognition error: ",
    noSpeechDetected: "No speech was detected. Please try again.",
  },
  [Language.HI]: {
    appName: "लूका एआई",
    headerTitle: "लूका एआई स्टडी असिस्टेंट",
    inputPlaceholder: "लूका एआई से कुछ भी पूछें या कोई छवि संलग्न करें...",
    inputPlaceholderLoading: "लूका एआई सोच रहा है...",
    sendButton: "भेजें",
    errorMessageTitle: "त्रुटि:",
    typingIndicator: "लूका टाइप कर रहा है...",
    loadingChat: "चैट लोड हो रहा है...",
    greeting: "नमस्ते! मैं लूका एआई हूँ। आज मैं आपकी पढ़ाई में कैसे मदद कर सकता हूँ? आप किसी छवि के बारे में भी प्रश्न पूछ सकते हैं या पूछने के लिए माइक्रोफ़ोन का उपयोग कर सकते हैं।",
    systemInstruction: `आप लूका एआई हैं, एक मैत्रीपूर्ण और जानकार अध्ययन सहायक।
आपका प्राथमिक लक्ष्य छात्रों को उनके शैक्षणिक प्रश्नों में मदद करना है, जिसमें उनके द्वारा प्रदान की गई छवियों से संबंधित प्रश्न या आवाज द्वारा पूछे गए प्रश्न भी शामिल हैं।
स्पष्ट, संक्षिप्त और सटीक स्पष्टीकरण हिंदी में प्रदान करें।
यदि कोई प्रश्न अस्पष्ट है, तो स्पष्टीकरण मांगें।
यदि कोई प्रश्न शैक्षणिक विषयों से बाहर है, तो विनम्रतापूर्वक अध्ययन-संबंधी सहायता पर अपना ध्यान केंद्रित करें।
पठनीयता में सुधार के लिए जहां उपयुक्त हो, सूचियों, बोल्डिंग या इटैलिक के लिए मार्कडाउन का उपयोग करके अपने उत्तरों को स्पष्ट रूप से प्रारूपित करें।
यदि आप किसी उत्तर के बारे में अनिश्चित हैं, तो संभावित रूप से गलत जानकारी प्रदान करने के बजाय यह बताएं कि आप अनिश्चित हैं।
जब किसी प्रश्न के साथ कोई छवि प्रदान की जाती है, तो प्रश्न के संदर्भ में छवि का विश्लेषण करें।`,
    apiKeyError: "गंभीर त्रुटि: एपीआई कुंजी गायब है। यह एप्लिकेशन इसके बिना कार्य नहीं कर सकता।",
    initializationFailed: "एआई सेवा प्रारंभ करने में विफल: ",
    chatInitializationError: "चैट सत्र प्रारंभ नहीं हुआ है। संदेश नहीं भेजा जा सकता।",
    aiResponseError: "एआई से प्रतिक्रिया प्राप्त करने में विफल: ",
    langEnglish: "English",
    langHindi: "हिन्दी",
    attachImageButtonLabel: "छवि संलग्न करें",
    imagePreviewLabel: "छवि:",
    removeImageButtonLabel: "हटाएँ",
    imageAltText: "उपयोगकर्ता द्वारा अपलोड की गई छवि",
    imageUploadError: "छवि लोड करने में विफल। कृपया कोई दूसरी छवि आज़माएँ।",
    speechToTextButtonLabelStart: "वॉयस इनपुट प्रारंभ करें",
    speechToTextButtonLabelStop: "वॉयस इनपुट रोकें",
    speechRecognitionNotSupported: "आपका ब्राउज़र वाक् पहचान का समर्थन नहीं करता है।",
    microphonePermissionDenied: "माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया इसे अपनी ब्राउज़र सेटिंग्स में सक्षम करें।",
    speechRecognitionError: "वाक् पहचान त्रुटि: ",
    noSpeechDetected: "कोई भाषण नहीं मिला। कृपया पुनः प्रयास करें।",
  },
};