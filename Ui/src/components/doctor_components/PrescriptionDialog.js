// import React, { useEffect, useState, useRef } from 'react';
// import {
//     Typography, Paper, Table, TableBody, TableCell, TableContainer,
//     Snackbar, TableHead, TableRow, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
// } from '@mui/material';
// import MicIcon from '@mui/icons-material/Mic';
// import PauseIcon from '@mui/icons-material/Pause';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import SendIcon from '@mui/icons-material/Send';
// import Slide from '@mui/material/Slide';
// import axios from 'axios';
// import apiConfig from '../../apiConfig';
// import MicOffIcon from '@mui/icons-material/MicOff';

// const PetientPresciption = (props) => {
//     const [isRecording, setIsRecording] = useState(false);
//     const [transcription, setTranscription] = useState('');
//     const [isPaused, setIsPaused] = useState(false);
//     const [openDialog, setOpenDialog] = useState(props.open);
//     const {open, setGeneratePrescription, appointmentID,selectedAppointmentData} = props
//     const recognition = useRef(null);

//     useEffect(() => {
//         if (!('webkitSpeechRecognition' in window)) {
//             alert('Speech recognition is not supported in your browser.');
//         } else {
//             recognition.current = new window.webkitSpeechRecognition();
//             recognition.current.continuous = true;
//             recognition.current.interimResults = true;
//             recognition.current.lang = 'en-US';

//             recognition.current.onstart = () => {
//                 setIsRecording(true);
//             };

//             recognition.current.onresult = (event) => {
//                 let interimTranscription = '';
//                 for (let i = event.resultIndex; i < event.results.length; ++i) {
//                     if (event.results[i].isFinal) {
//                         setTranscription(prevTranscription => prevTranscription + ' ' + event.results[i][0].transcript);
//                     } else {
//                         interimTranscription += event.results[i][0].transcript;
//                     }
//                 }
//             };

//             recognition.current.onend = () => {
//                 setIsRecording(false);
//             };

//             recognition.current.onerror = (event) => {
//                 console.error('Speech recognition error:', event.error);
//                 setIsRecording(false);
//             };
//         }

//         return () => {
//             if (recognition.current) {
//                 recognition.current.stop();
//             }
//         };
//     }, []);

//     const handleMicButtonClick = () => {
//         if (!isRecording && !isPaused) {
//             recognition.current.start();
//         } else if (isPaused) {
//             recognition.current.start();
//             setIsPaused(false);
//         } else {
//             recognition.current.stop();
//             setIsPaused(true);
//         }
//     };

//     const handleSend = async () => {
//         let payload = selectedAppointmentData
//         let doc_id = payload.doctor.id
//         let pat_id = payload.patient.id
//         payload.doctor = doc_id
//         payload.patient = pat_id
//         payload.prescription = transcription
//         try {
//             let url = `${apiConfig.baseURL}/patient/api/appointment/${appointmentID}/`;
//             console.log(url);
//             const response = await axios.put(url, payload);
//             console.log(response.data);
//             if (response.status == 200){
//                 window.location.reload();

//             }
            
//         } catch (error) {
            
//             console.error('error:', error);
//         }
//         setOpenDialog(false);
//     };

//     return (
//         <div>
//             {/* <Button onClick={() => setOpenDialog(true)}>Generate Prescription</Button> */}
//             <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
//                 <DialogTitle>Prescription</DialogTitle>
//                 <br />
                
//                 <DialogContent>
//                 <IconButton onClick={handleMicButtonClick} color="primary">
//                         {isRecording && !isPaused ? <MicIcon /> : <MicOffIcon />}
//                     </IconButton>
//                     <TextField
//                         multiline
//                         fullWidth
//                         value={transcription}
//                         onChange={(e) => setTranscription(e.target.value)}
//                         rows={10}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleSend} color="primary" disabled={!transcription.trim()}>
//                         Send
//                     </Button>
                    
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default PetientPresciption;


import React, { useEffect, useState, useRef } from "react";
import { Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import io from "socket.io-client";
import axios from "axios";
import apiConfig from "../../apiConfig";

const sampleRate = 16000;

const getMediaStream = () =>
  navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: "default",
      sampleRate: sampleRate,
      sampleSize: 16,
      channelCount: 1,
    },
    video: false,
  });

const PetientPresciption = (props) => {
  const [connection, setConnection] = useState();
  const [currentRecognition, setCurrentRecognition] = useState("");
  const [recognitionHistory, setRecognitionHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const processorRef = useRef();
  const audioContextRef = useRef();
  const audioInputRef = useRef();
  const [transcription, setTranscription] = useState("");
  const [openDialog, setOpenDialog] = useState(props.open);
  const recognition = useRef(null);
  const speechRecognized = (data) => {
    if (data.isFinal) {
      setCurrentRecognition("...");
      setRecognitionHistory((old) => [data.text, ...old]);
    } else setCurrentRecognition(data.text + "...");
  };
  useEffect(() => {
    const socket = io.connect("http://localhost:8081");
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setConnection(socket);
    });

    socket.emit("send_message", "hello world");

    socket.emit("startGoogleCloudStream");

    socket.on("receive_message", (data) => {
        console.log(data)
      console.log("received message", data);
    });

    socket.on("receive_audio_text", (data) => {
        speechRecognized(data);
      console.log("received audio text", data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected", socket.id);
    });
  }, []);

  useEffect(() => {
    console.log("\n\nrecognitionHistory", recognitionHistory);
  }, [recognitionHistory]);

  const connect = async () => {
    if (isRecording) return;

    const stream = await getMediaStream();

    audioContextRef.current = new window.AudioContext();
    console.log('testt')
    await audioContextRef.current.audioWorklet.addModule("/src/worklets/recorderWorkletProcessor.js");
    console.log('testt1')
    
    audioContextRef.current.resume();

    audioInputRef.current = audioContextRef.current.createMediaStreamSource(stream);

    processorRef.current = new AudioWorkletNode(audioContextRef.current, "recorder.worklet");

    processorRef.current.connect(audioContextRef.current.destination);
    audioContextRef.current.resume();

    audioInputRef.current.connect(processorRef.current);

    processorRef.current.port.onmessage = (event) => {
      const audioData = event.data;
    //   console.log(audioData,'kkk')
      connection.emit("send_audio_data", { audio: audioData });
    };

    setIsRecording(true);
  };

  const disconnect = () => {
    if (!isRecording) return;

    processorRef.current.disconnect();
    audioInputRef.current.disconnect();
    audioContextRef.current.close();

    setIsRecording(false);
  };

  const handleMicButtonClick = () => {
    if (!isRecording) {
      connect();
    } else {
      disconnect();
    }
  };

  const handleSend = async () => {
    // Your send functionality
    setOpenDialog(false);
  };
  console.log("Current recognition:", currentRecognition);

  return (
    <div>
      <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Prescription</DialogTitle>
        <br />

        <DialogContent>
          <IconButton onClick={handleMicButtonClick} color="primary">
            {isRecording ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
          {/* <TextField multiline fullWidth value={currentRecognition} onChange={(e) => setCurrentRecognition(e.target.value)} rows={10} /> */}
          <TextField 
  multiline 
  fullWidth 
  value={currentRecognition?.trim() || ""} 
  onChange={(e) => setTranscription(e.target.value)} 
  rows={10} 
/>



        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend} color="primary" disabled={!currentRecognition.trim()}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PetientPresciption;
