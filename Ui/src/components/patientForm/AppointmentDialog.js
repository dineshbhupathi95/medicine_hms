import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, MenuItem } from '@mui/material';
import axios from 'axios';
import apiConfig from '../../apiConfig';

const AppointmentScheduleDialog = ({ open,setSnackAppointmentOpen, handleClose }) => {
    const [formData, setFormData] = useState({
        appointment_date: '',
        patient: '',
        doctor: '',
        appointment_time: '',
        bp: '',
        temp: '',
        weight: ''
    });

    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [blockedSlots, setBlockedSlots] = useState([])
    // console.log(filteredDoctors,'ddo')

    useEffect(() => {
        // Fetch patients and doctors data from backend APIs
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${apiConfig.baseURL}/patient/api/create/`);
                setPatients(response.data);
                setFilteredPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${apiConfig.baseURL}/patient/api/doctors/`);
                setDoctors(response.data);
                setFilteredDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchPatients();
        fetchDoctors();
    }, []);

    // Function to fetch appointment slots for the selected doctor
    const fetchDoctorSlots = async (doctorId, date) => {
        try {
            const response = await axios.get(`${apiConfig.baseURL}/user/api/doctor-slots/${doctorId}/?date=${date}`);
            setAppointmentSlots(response.data);
        } catch (error) {
            console.error('Error fetching doctor slots:', error);
        }
    };

    const handlePatientSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filtered = patients.filter((patient) =>
            patient.patient_name.toLowerCase().includes(searchQuery)
        );
        setFilteredPatients(filtered);
    };

    const handleDoctorSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filtered = doctors.filter((doctor) =>
            doctor.username.toLowerCase().includes(searchQuery) ||
            doctor.department.toLowerCase().includes(searchQuery)
        );
        setFilteredDoctors(filtered);
    };
    const getFormattedDate = () => {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = currentDate.getFullYear();
        return `${year}-${month}-${day}`;
    };
    const checkBlockedSlots = async (doc_id) =>{
        try {
            let url = `${apiConfig.baseURL}/patient/api/doctor/${doc_id}/patients/?appointment_date=${formData.appointment_date}`;
            //   console.log(url);
            const response = await axios.get(url, {});
            // console.log(response.data)
            const appointments = response.data;
            const allAppointmentTimes = [].concat(...appointments.map(appointment => appointment.appointment_time));
            setBlockedSlots(allAppointmentTimes)
                } catch {

        }
    }
    const getPatientAlreadyAssigned = async (doc_id,patient_id) => {
        try {
            let url = `${apiConfig.baseURL}/patient/api/doctor/${doc_id}/patients/?appointment_date=${formData.appointment_date}`;
            //   console.log(url);
            const response = await axios.get(url, {});
            console.log(response.data)
            const appointments = response.data;
            // Check if patient_id is already present in any appointment
        const isPatientAssigned = appointments.some(appointment => appointment.patient.id === patient_id);
        
        console.log("Is patient assigned:", isPatientAssigned);
        
        return isPatientAssigned;
        } catch {

        }
    }
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        // Fetch appointment slots when doctor selection is made
        if (event.target.name === 'doctor') {
            try{
            checkBlockedSlots(event.target.value)
            fetchDoctorSlots(event.target.value, formData.appointment_date);
            }
            catch{
                
            }
        }
    };
    console.log(blockedSlots,'blocked')
    console.log(appointmentSlots)
    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setFormData({ ...formData, appointment_time: `${slot.start_time}` });
    };
    const handleCloseModel = () =>{
        setBlockedSlots([])
        handleClose()
    }
    const handleSubmit = async () => {
        console.log(formData);
        setBlockedSlots([])
        try{
            let assignedAlready = await getPatientAlreadyAssigned(formData.doctor, formData.patient);
            console.log(assignedAlready)
        if (assignedAlready == true){
            alert(`already patient assigned to the doctor ${formData.appointment_date}`)
            setFormData({
                appointment_date: '',
                patient: '',
                doctor: '',
                appointment_time: '',
                bp: '',
                temp: '',
                weight: ''
            })
        }
        else{
        try {
            const response = await axios.post(`${apiConfig.baseURL}/patient/api/appointment/`, formData);
            console.log(response);
            if (response.status == 201){
                setSnackAppointmentOpen(true)
            }
            setFormData({
                appointment_date: '',
                patient: '',
                doctor: '',
                appointment_time: '',
                bp: '',
                temp: '',
                weight: ''
            })
        } catch (error) {
            console.log(error);
        }
    }}
    catch(e){
        
    }
        handleClose();
    };
    /// Get the current date in "YYYY-MM-DD" format
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (open) {
            setFormData({
                appointment_date: '',
                patient: '',
                doctor: '',
                appointment_time: ''
            });
            setAppointmentSlots([]);
            setSelectedSlot(null);
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Appointment Date"
                            type="date"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: getCurrentDate() }} // Prevent selecting previous date

                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Patient"
                            name="patient"
                            value={formData.patient}
                            onChange={handleChange}
                            fullWidth
                        >
                            {filteredPatients.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                    {patient.patient_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Doctor"
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            fullWidth
                        >
                            {filteredDoctors.map((doctor) => (
                                <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.username} - {doctor.department ? doctor.department.name : 'None'} - {doctor.qualification ? doctor.qualification.name : 'None'} - {doctor.experience? doctor.experience:"None"}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="BP"
                            fullWidth
                            name="bp"
                            value={formData.bp}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Temperature"
                            fullWidth
                            name="temp"
                            value={formData.temp}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Weight"
                            fullWidth
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {/* Render appointment slots as buttons */}
                        {appointmentSlots.map((slot, index) => (
    <Button
        key={index}
        variant="contained"
        onClick={() => handleSlotSelect(slot)}
        disabled={blockedSlots.includes(slot.start_time)} // Disable button if slot is blocked
        style={{
            backgroundColor: blockedSlots.includes(slot.start_time) ? '#c0c0c0' : (selectedSlot && slot.start_time === selectedSlot.start_time ? '#7a05f0' : '#1976d2'),
            color: '#ffffff',
            marginRight: '10px',
            marginBottom: '10px'
        }}
    >
        {slot.start_time} - {slot.end_time}
    </Button>
))}
                    </Grid>
                </Grid>
            </DialogContent>
            <Grid container justifyContent="flex-end" spacing={2} style={{ padding: '16px' }}>
                <Grid item>
                    <Button onClick={handleCloseModel} color="secondary">Cancel</Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: '#1976d2', color: '#fff' }}>Schedule</Button>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default AppointmentScheduleDialog;
