import React, { useEffect, useState } from 'react';
import {
    Typography, Paper, Table, TableBody, TableCell, TableContainer,
    Snackbar, TableHead, TableRow, Button, TextField, IconButton
} from '@mui/material';
import { useParams } from 'react-router-dom'; // Import useParams hook
import axios from 'axios';
import apiConfig from '../../apiConfig';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Slide from '@mui/material/Slide';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PetientPresciption from './PrescriptionDialog';


const PrescriptionDialog = ({ selectedAppointmentData, prescription, open, onClose, onUpdate }) => {
    // window.open(`http://localhost:8000/media/${selectedAppointmentData.patient.patient_name}_prescription${selectedAppointmentData.id}.pdf`)
    // const [changeValue, setChangeValue] = useState(prescription);

    // const handleChangePrescription = (e) => {
    //     setChangeValue(e.target.value);
    // };

    // const handleUpdate = () => {
    //     onUpdate(changeValue); // Pass the updated prescription value
    //     onClose(); // Close the dialog after updating
    // };

    // const handleSendEmail = () => {
    //     // Implement send email function
    //     console.log(selectedAppointmentData);
    //     console.log('Sending email...');
    // };

    // const handleSendSMS = async () => {
    //     // Implement send SMS function
    //     console.log('Sending SMS...');
    //     let smsPayload = {
    //         'to': '+91' + selectedAppointmentData.patient.mobile_number,
    //         'body': changeValue || prescription
    //     };
    //     console.log(smsPayload);
    //     try {
    //         const response = await axios.post(`${apiConfig.baseURL}/user/api/send-sms/`, smsPayload);
    //         console.log(response);
    //         if (response.status === 200) {
    //             alert('success');
    //             onClose(); // Close the dialog after updating
    //         }
    //     } catch {
    //         alert('error');
    //     }
    // };

    // const handleSendWhatsApp = async () => {
    //     // Implement send WhatsApp function
    //     console.log('Sending WhatsApp message...');
    //     let whatsAppPayload = {
    //         'to': '+91' + selectedAppointmentData.patient.mobile_number,
    //         'body': changeValue || prescription
    //     };
    //     console.log(whatsAppPayload);
    //     try {
    //         const response = await axios.post(`${apiConfig.baseURL}/user/api/send-whatsapp/`, whatsAppPayload);
    //         console.log(response);
    //         if (response.status === 200) {
    //             alert('success');
    //             onClose(); // Close the dialog after updating
    //         }
    //     } catch {
    //         alert('error');
    //     }
    // };
    // const handleGeneratePDF = async () => {
    //     const pdfPayload = {
    //         hospital_name: 'Medi Mind',
    //         hospital_address: 'Banjarahills',
    //         doctor_name: 'Ramesh',
    //         doctor_specialization: 'Neurology',
    //         prescription: changeValue || prescription,
    //     };
    
    //     try {
    //         // Fetch CSRF token from the cookie
    //         const csrftoken = getCookie('csrftoken');
    
    //         // Include CSRF token in the request headers
    //         const response = await axios.post(
    //             `${apiConfig.baseURL}/patient/generate-pdf/`,
    //             pdfPayload,
    //             {
    //                 headers: {
    //                     'X-CSRFToken': csrftoken,
    //                 },
    //                 responseType: 'blob', // Set response type to blob for binary data
    //             }
    //         );
    
    //         const url = window.URL.createObjectURL(new Blob([response.data])); // Create URL for blob data
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'prescription.pdf'); // Set filename for download
    //         document.body.appendChild(link);
    //         link.click(); // Trigger download
    //     } catch (error) {
    //         alert('Error generating PDF');
    //     }
    // };
    
    // Function to retrieve CSRF token from cookies
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    // return (
    //     <Dialog fullWidth open={open} onClose={onClose}>
    //         <DialogTitle>Prescription</DialogTitle>
    //         <DialogContent>
    //             <textarea
    //                 rows="6"
    //                 cols="50"
    //                 onChange={handleChangePrescription}
    //                 defaultValue={prescription}
    //             />
    //         </DialogContent>
    //         <DialogActions>
    //             <IconButton onClick={handleSendEmail} color="primary">
    //                 <EmailIcon />
    //             </IconButton>
    //             <IconButton onClick={handleSendSMS} color="primary">
    //                 <SmsIcon />
    //             </IconButton>
    //             <IconButton onClick={handleSendWhatsApp} color="primary">
    //                 <WhatsAppIcon />
    //             </IconButton>
    //             <Button onClick={handleGeneratePDF} variant="contained" color="primary">
    //                 Download PDF
    //             </Button>
    //             <Button onClick={onClose} variant="contained" color="primary">
    //                 Close
    //             </Button>
    //             <Button onClick={handleUpdate} variant="contained" color="primary">
    //                 Update
    //             </Button>
    //         </DialogActions>
    //     </Dialog>
    // );
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
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State variable to control snackbar visibility
    const [snackMessage, setSnackMessage] = useState()
    const [selectedAppointmentData, setSelectedAppointmentData] = useState()
    const [prescriptionDialog, setPrescriptionDialog] = useState(false)
    const [generatePrescription, setGeneratePrescription] = useState()


    const SpeechRecognization = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognization

    useEffect(() => {
        getPatientHistory()
    }, [id])
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
        // setSelectedAppointmentData(data)
        // setViewPrescription(data.prescription)
        // setOpenPrescription(true)
        // setSelectedAppointmentID(appointment_id)
        window.open(`http://localhost:8000/media/${data.patient.patient_name}_prescription${data.id}.pdf`)

    }

    const handleGeneratePrescription = (appoint_id) => {
        setPrescriptionDialog(true)
        setSelectedAppointmentID(appoint_id)
        let payload = appointments.find((appointment) => appointment.id == appoint_id)
        setSelectedAppointmentData(payload)
        // // Placeholder function for generating setSelectedAppointmentDataprescription
        // console.log('Prescription generated.');
        // recognition.continuous = false;
        // recognition.interimResults = false;
        // recognition.lang = 'en-US';

        // recognition.onstart = () => {
        //     setIsRecording(true);
        // };

        // recognition.onresult = (event) => {
        //     const result = event.results[0][0].transcript;
        //     if (transcription) {
        //         setTranscription(prevTranscription => prevTranscription + ' ' + result);
        //     } else {
        //         setTranscription(result);
        //     }
        // };

        // recognition.onend = () => {
        //     setIsRecording(false);
        // };

        // recognition.onerror = (event) => {
        //     console.error('Speech recognition error:', event.error);
        //     setIsRecording(false);
        // };

        // recognition.start();

    };
    const onSend = async () => {
        // alert(selectedAppointmentID)
        let payload = appointments.find((appointment) => appointment.id == selectedAppointmentID)
        let doc_id = payload.doctor.id
        let pat_id = payload.patient.id
        payload.doctor = doc_id
        payload.patient = pat_id
        payload.prescription = transcription
        console.log(payload)
        try {
            let url = `${apiConfig.baseURL}/patient/api/appointment/${selectedAppointmentID}/`;
            console.log(url);
            const response = await axios.put(url, payload);
            console.log(response.data);
            if (response.status == 200){
                setTranscription('')
                setSnackMessage('Prescription updated successfully!')
                setSnackbarOpen(true);
                getPatientHistory()
            }
            //   setAssignedPatients(response.data);
        } catch (error) {
            setSnackMessage('Prescription update failed!')
            setSnackbarOpen(true);
            console.error('error:', error);
        }
    }
    const handleUpdatePrescription = async (updatedPrescription) => {
        // const appointmentIndex = appointments.findIndex(appointment => appointment.id === selectedAppointmentID);
        let appointmentData = appointments.find(appointment => appointment.id === selectedAppointmentID)
        let doc_id = appointmentData.doctor.id
        let pat_id = appointmentData.patient.id
        appointmentData.doctor = doc_id
        appointmentData.patient = pat_id
        appointmentData.prescription = updatedPrescription
        try {
            let url = `${apiConfig.baseURL}/patient/api/appointment/${selectedAppointmentID}/`;
            console.log(url);
            const response = await axios.put(url, appointmentData);
            if (response.status == 200) {
                setSnackMessage('Prescription updated successfully!')
                setSnackbarOpen(true);
                getPatientHistory()

            }
        } catch (error) {
            setSnackMessage('Prescription update failed!')
            setSnackbarOpen(true);
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
            </Paper>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6">Appointments</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Visit Doctor</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Prescription</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appointment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{appointment.appointment_date}</TableCell>
                                    <TableCell>{appointment.appointment_time}</TableCell>
                                    <TableCell>{appointment.doctor ? appointment.doctor.username : 'N/A'}</TableCell>
                                    <TableCell>{appointment.doctor && appointment.doctor.department ? appointment.doctor.department.name : 'N/A'}</TableCell>

                                    <TableCell>
                                        {appointment.prescription ? (
                                            <Button onClick={() => handleViewPrescription(appointment.id)} variant="outlined" color="primary">View Prescription</Button>
                                        ) : (
                                            <Button onClick={() => handleGeneratePrescription(appointment.id)} variant="contained" >
                                                Generate Prescription
                                                {/* color={isRecording ? "secondary" : "primary"}{isRecording ? "Listening..." : "Generate Prescription"} <MicIcon /> */}
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
            {/* <PrescriptionDialog selectedAppointmentData={selectedAppointmentData} prescription={viewPrescription} open={openPrescription} onClose={() => setOpenPrescription(false)} onUpdate={handleUpdatePrescription} /> */}
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackMessage}
                TransitionComponent={Slide}
                transitionDuration={500}
                sx={{ marginTop: '64px' }} // Adjust the margin top as needed
            />
            {prescriptionDialog && (<PetientPresciption open={prescriptionDialog} setGeneratePrescription={setGeneratePrescription} appointmentID={selectedAppointmentID} selectedAppointmentData={selectedAppointmentData}/>)}
        </div>
    );
};

export default PatientDetailsComponent;
