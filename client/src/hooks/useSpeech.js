import { useCallback, useEffect, useRef, useState } from 'react';

export default function useSpeech({ onResult }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const recRef = useRef(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(Boolean(Ctor));
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(
    (lang = 'en-IN') => {
      const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Ctor) {
        setError('Voice input is not supported in this browser. Type your question instead.');
        return;
      }
      setError('');
      const recognition = new Ctor();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const text = event.results[0]?.[0]?.transcript;
        if (text) onResult(text);
      };
      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') setError('Microphone permission was denied.');
        else if (event.error === 'no-speech') setError('No speech detected. Try again.');
        else setError('Voice recognition failed. You can still type.');
        setListening(false);
      };
      recognition.onend = () => setListening(false);
      recRef.current = recognition;
      setListening(true);
      recognition.start();
    },
    [onResult]
  );

  const [speaking, setSpeaking] = useState(false);

  const cancelSpeech = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text, lang = 'en') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    // Completely strip markdown headers (###), asterisks, dashes, brackets, and URLs
    let cleanText = String(text || '')
      .replace(/#+/g, '') // Removes any # or ###
      .replace(/https?:\/\/\S+/g, 'official portal')
      .replace(/[*_~`>[\]()]/g, '')
      .replace(/^[\s-–—*•]+/gm, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  return { supported, listening, speaking, error, start, stop, speak, cancelSpeech };
}
