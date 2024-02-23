import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, MenuItem } from '@mui/material';
import axios from 'axios';
import apiConfig from '../../apiConfig';

const AppointmentScheduleDialog = ({ open, handleClose }) => {
    const [formData, setFormData] = useState({
        appointment_date: '',
        patient: '',
        doctor: '',
        appointment_time: ''
    });

    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

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

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        // Fetch appointment slots when doctor selection is made
        if (event.target.name === 'doctor') {
            fetchDoctorSlots(event.target.value, formData.appointment_date);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setFormData({ ...formData, appointment_time: `${slot.start_time}` });
    };

    const handleSubmit = async () => {
        console.log(formData);
        try {
            const response = await axios.post(`${apiConfig.baseURL}/patient/api/appointment/`, formData);
            console.log(response);
        } catch (error) {
            console.log(error);
        }

        handleClose();
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
                    <Grid item xs={12}>
                        <TextField
                            label="Appointment Date"
                            type="date"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
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
                    <Grid item xs={12}>
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
                                    {doctor.username} - {doctor.department.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        {/* Render appointment slots as buttons */}
                        {appointmentSlots.map((slot, index) => (
                            <Button
                                key={index}
                                variant="contained"
                                onClick={() => handleSlotSelect(slot)}
                                style={{
                                    backgroundColor: selectedSlot && slot.start_time === selectedSlot.start_time ? '#7a05f0' : '#1976d2',
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
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: '#1976d2', color: '#fff' }}>Schedule</Button>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default AppointmentScheduleDialog;
