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

  const speak = useCallback((text, lang = 'en') => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  return { supported, listening, error, start, stop, speak };
}
