import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom'; // Import useParams hook
import axios from 'axios';
import apiConfig from '../../apiConfig';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// import PrescriptionDialog from './ViewPrescription';

const PrescriptionDialog = ({ prescription, open, onClose ,onUpdate}) => {
    const [changeValue,setChangeValue] = useState(prescription)
    const handleChangePrescription = (e) =>{
        console.log(e.target.value)
        setChangeValue(e.target.value)
    }   
    const handleUpdate = () => {
        onUpdate(changeValue); // Pass the updated prescription value
        onClose(); // Close the dialog after updating
    };
    return (
        <Dialog 
        fullWidth
        open={open} onClose={onClose}>
            <DialogTitle>Prescription</DialogTitle>
            <TextField 
            multiline
            fullWidth
            onChange={handleChangePrescription}
            defaultValue={prescription}
            />
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                <Button onClick={handleUpdate} color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const PatientDetailsComponent = () => {
    const { id } = useParams(); // Get the patient ID from the URL
    const [patientDetails, setPatientDetails] = useState({})
    const [appointments, setAppointments] = useState([])
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [selectedAppointmentID, setSelectedAppointmentID] = useState()
    const [viewPrescription, setViewPrescription] = useState()
    const [openPrescription, setOpenPrescription] = useState(false)

    const SpeechRecognization = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognization

    useEffect(() => {
        getPatientHistory()
    }, [])
    const getPatientHistory = async () => {
        try {
            let url = `${apiConfig.baseURL}/patient/api/patient-details/${id}`;
            const response = await axios.get(url, {});
            console.log(response.data);
            let patient = response.data
            setPatientDetails(
                {
                    "patient_id": patient.patient_id,
                    "name": patient.patient_name,
                    "mobile_number": patient.mobile_number,
                    "age": patient.age,
                    "gender": patient.gender
                }
            )
            setAppointments(patient.appointments)
        } catch (error) {
            console.error('error:', error);

        }
    }
    const handleViewPrescription = async (appointment_id) => {
        let data = appointments.find((appointment) => appointment.id == appointment_id)
        setViewPrescription(data.prescription)
        setOpenPrescription(true)
        setSelectedAppointmentID(appointment_id)

    }

    const handleGeneratePrescription = (appoint_id) => {
        setSelectedAppointmentID(appoint_id)
        // Placeholder function for generating prescription
        console.log('Prescription generated.');
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            if (transcription) {
                setTranscription(prevTranscription => prevTranscription + ' ' + result);
            } else {
                setTranscription(result);
            }
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };

        recognition.start();

    };
    const onSend = async () => {
        // alert(selectedAppointmentID)
        let payload = appointments.find((appointment) => appointment.id == selectedAppointmentID)
        payload.prescription = transcription
        console.log(payload)
        try {
            let url = `${apiConfig.baseURL}/patient/api/appointment/${selectedAppointmentID}/`;
            console.log(url);
            const response = await axios.put(url, payload);
            console.log(response.data);
            //   setAssignedPatients(response.data);
        } catch (error) {
            console.error('error:', error);
        }
    }
    const handleUpdatePrescription = async (updatedPrescription) => {
        // Find the appointment index
        const appointmentData = appointments.find(appointment => appointment.id === selectedAppointmentID);
        appointmentData.prescription = updatedPrescription
        try {
            let url = `${apiConfig.baseURL}/patient/api/appointment/${selectedAppointmentID}/`;
            console.log(url);
            const response = await axios.put(url, appointmentData);
            console.log(response.data);
            //   setAssignedPatients(response.data);
        } catch (error) {
            console.error('error:', error);
        }
    };
    return (
        <div>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Patient Details</Typography>
                <Typography>PatientID: {patientDetails.patient_id}</Typography>
                <Typography>Name: {patientDetails.name}</Typography>
                <Typography>Age: {patientDetails.age}</Typography>
                <Typography>Gender: {patientDetails.gender}</Typography>
                {/* <Typography>Address: {patientDetails.address}</Typography>
        <Typography>Email: {patientDetails.email}</Typography>
        <Typography>Phone: {patientDetails.phone}</Typography> */}
            </Paper>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6">Appointments</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Prescription</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appointment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{appointment.appointment_date}</TableCell>
                                    <TableCell>{appointment.appointment_time}</TableCell>
                                    <TableCell>
                                        {appointment.prescription ? (
                                            <Button onClick={() => handleViewPrescription(appointment.id)} variant="outlined" color="primary">View Prescription</Button>
                                        ) : (
                                            <Button onClick={() => handleGeneratePrescription(appointment.id)} variant="contained" color={isRecording ? "secondary" : "primary"}>
                                                {isRecording ? "Listening..." : "Generate Prescription"} <MicIcon />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {transcription && (
                    <TextField
                        label="Transcription"
                        value={transcription}
                        onChange={(e) => setTranscription(e.target.value)} // Call setTranscription when the value changes
                        multiline
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={onSend} color="primary">
                                    <SendIcon />
                                </IconButton>
                            ),
                            sx: {
                                maxHeight: 200,
                                overflowY: 'auto',
                            },
                        }}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                )}
            </Paper>
            <PrescriptionDialog prescription={viewPrescription} open={openPrescription} onClose={() => setOpenPrescription(false)} onUpdate={handleUpdatePrescription}/>
        </div>
    );
};

export default PatientDetailsComponent;
