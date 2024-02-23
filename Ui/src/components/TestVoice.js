import React, { useState, useEffect } from 'react';

function TestApp() {
  const [transcript, setTranscript] = useState('');
  const [isFinal, setIsFinal] = useState(false);
  const [socket, setSocket] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket('ws://localhost:8000/ws/transcribe/');
    ws.onopen = () => console.log('Connected to WebSocket server');
    ws.onclose = () => console.log('Disconnected from WebSocket server');
    ws.onerror = error => console.error('WebSocket error:', error);

    // Handle messages received from WebSocket server
    ws.onmessage = event => {
      console.log('Received message:', event.data); // Log received message
      const data = JSON.parse(event.data);
      setTranscript(prevTranscript => prevTranscript + data.transcript);
      setIsFinal(data.is_final);
    };

    setSocket(ws);

    // Clean up WebSocket connection
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    console.log('Recording started');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);

      setAudioContext(context);
      setAudioStream(stream);

      // Connect audio stream to WebSocket for streaming transcription
      const scriptProcessorNode = context.createScriptProcessor(4096, 1, 1);
      scriptProcessorNode.onaudioprocess = event => {
        const data = event.inputBuffer.getChannelData(0);
        if (socket) {
        // Convert binary data to text using TextEncoder
        const encoder = new TextEncoder();
        const textData = encoder.encode(data);
        console.log(textData)
        // Send the text data over the WebSocket connection
        socket.send(textData);
        }
      };
      source.connect(scriptProcessorNode);
      scriptProcessorNode.connect(context.destination);
    } catch (error) {
      console.error('Error initializing AudioContext:', error);
    }
  };

  const handleStopRecording = () => {
    console.log('Recording stopped');
    // You can add logic here to handle recording stop
  };

  return (
    <div className="App">
      <h1>Speech-to-Text Transcription</h1>
      <div className="transcript">
        <p>{transcript}</p>
        {isFinal && <p className="final">Final</p>}
      </div>
      <div className="controls">
        <button onClick={handleStartRecording}>Start Recording</button>
        <button onClick={handleStopRecording}>Stop Recording</button>
      </div>
    </div>
  );
}

export default TestApp;