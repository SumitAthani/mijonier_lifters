import React, { useRef, useState } from "react";
import CasualtyReport from "./CasualtyReport";

const SoundRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [report, setReport] = useState(null); // This state is now passed as a prop

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ... (All your logic functions: startRecording, stopRecording, sendAudioToBackend) ...
  // ... (No changes needed in those functions) ...

  // --- 1. Start Recording ---
  const startRecording = async () => {
    setStatus("Getting microphone...");
    setReport(null); // Clear the old report
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        sendAudioToBackend(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('Recording... Press "Stop" when finished.');
    } catch (err) {
      console.error("Error starting recording:", err);
      setStatus("Error: Could not start recording. Check mic permissions.");
    }
  };

  // --- 5. Stop Recording ---
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus("Processing... Please wait.");
    }
  };

  const saveAudioLocally = (audioBlob) => {
    const url = URL.createObjectURL(audioBlob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "casualty_report.webm";
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
  };
  // --- 6. Send Audio to Backend ---
  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audioFile", audioBlob, "casualty_report.webm");
    saveAudioLocally(audioBlob);
    try {
      const response = await fetch(
        "http://localhost:4000/process-casualty-report",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setReport(data); // Set the final JSON report
      setStatus("Report Complete!");
    } catch (err) {
      console.error("Error sending audio to backend:", err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎤 Casualty Reporter (React)</h1>
        <p>
          Press "Start" to record your audio report. Press "Stop" to process.
        </p>

        <div className="controls">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="start-btn"
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="stop-btn"
          >
            Stop Recording
          </button>
        </div>

        <h3>Status: {status}</h3>

        {/*
          // <-- 2. This is the only change in the JSX.
          // We replaced the <pre> tag with our new component.
        */}
        <CasualtyReport report={report} />
      </header>
    </div>
  );
};

export default SoundRecorder;
