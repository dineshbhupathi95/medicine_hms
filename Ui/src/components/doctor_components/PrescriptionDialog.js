import React, { useEffect, useState, useRef } from 'react';
import {
    Typography, Paper, Table, TableBody, TableCell, TableContainer,
    Snackbar, TableHead, TableRow, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import apiConfig from '../../apiConfig';
import MicOffIcon from '@mui/icons-material/MicOff';

const PetientPresciption = (props) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [openDialog, setOpenDialog] = useState(props.open);
    const {open, setGeneratePrescription, appointmentID,selectedAppointmentData} = props
    const recognition = useRef(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser.');
        } else {
            recognition.current = new window.webkitSpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.lang = 'en-US';

            recognition.current.onstart = () => {
                setIsRecording(true);
            };

            recognition.current.onresult = (event) => {
                let interimTranscription = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscription(prevTranscription => prevTranscription + ' ' + event.results[i][0].transcript);
                    } else {
                        interimTranscription += event.results[i][0].transcript;
                    }
                }
            };

            recognition.current.onend = () => {
                setIsRecording(false);
            };

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };
        }

        return () => {
            if (recognition.current) {
                recognition.current.stop();
            }
        };
    }, []);

    const handleMicButtonClick = () => {
        if (!isRecording && !isPaused) {
            recognition.current.start();
        } else if (isPaused) {
            recognition.current.start();
            setIsPaused(false);
        } else {
            recognition.current.stop();
            setIsPaused(true);
        }
    };

    const handleSend = async () => {
        let payload = selectedAppointmentData
        let doc_id = payload.doctor.id
        let pat_id = payload.patient.id
        payload.doctor = doc_id
        payload.patient = pat_id
        payload.prescription = transcription
        try {
            let url = `${apiConfig.baseURL}/patient/api/appointment/${appointmentID}/`;
            console.log(url);
            const response = await axios.put(url, payload);
            console.log(response.data);
            if (response.status == 200){
                window.location.reload();

            }
            
        } catch (error) {
            
            console.error('error:', error);
        }
        setOpenDialog(false);
    };

    return (
        <div>
            {/* <Button onClick={() => setOpenDialog(true)}>Generate Prescription</Button> */}
            <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Prescription</DialogTitle>
                <br />
                
                <DialogContent>
                <IconButton onClick={handleMicButtonClick} color="primary">
                        {isRecording && !isPaused ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>
                    <TextField
                        multiline
                        fullWidth
                        value={transcription}
                        onChange={(e) => setTranscription(e.target.value)}
                        rows={10}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSend} color="primary" disabled={!transcription.trim()}>
                        Send
                    </Button>
                    
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PetientPresciption;
