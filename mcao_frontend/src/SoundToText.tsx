import React, { useEffect, useRef, useState } from "react";
 
export default function SpeechToText() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [lang, setLang] = useState("en-US");
  const recognitionRef = useRef<any>(null);
 
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;
 
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
 
    // Create recognition instance only once
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
 
    recognition.onstart = () => setListening(true);
 
    recognition.onend = () => setListening(false);
 
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + " " + transcript);
    };
 
    recognitionRef.current = recognition;
 
    return () => {
      recognition.stop();
    };
  }, [lang]);
 
  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.start();
  };
 
  return (
    <div className="p-4 space-y-4">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="en-US">English (US)</option>
        <option value="hi-IN">Hindi</option>
        <option value="en-IN">English (India)</option>
        <option value="fr-FR">French</option>
        {/* add more */}
      </select>
 
      <button
        onClick={startListening}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {listening ? "Listening..." : "Start Voice Input"}
      </button>
 
      <button
        onClick={() => setText("")}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Clear
      </button>
 
      <div className="border p-3 rounded min-h-[100px]">{text}</div>
    </div>
  );
}
 