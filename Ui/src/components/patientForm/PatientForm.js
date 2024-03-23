// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import apiConfig from '../../apiConfig';
// import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, 
//   Grid, MenuItem, Select, FormControl, InputLabel,TableContainer,Paper,Table,TableHead,TableRow,TableCell,TableBody } from '@mui/material';


// const CreatePatientForm = ({ open, handleClose }) => {
//     const [formData, setFormData] = useState({
//         patient_name:'',
//         mobile_number:'',
//         age: '',
//         gender: '',
//     });

//     // Function to handle form submission
//     const handleSubmit = async (event) => {
//       console.log(formData)
//       event.preventDefault();
//       try{
//         const response = await axios.post(`${apiConfig.baseURL}/patient/api/create/`, formData);
//         console.log(response)
//       }
//       catch(error){
//         console.log(error)
//       }
//       handleClose(); // Close the dialog after form submission
//     };

//     const handleChange = (event) => {
//       const { name, value } = event.target;
//       console.log(event.target)
//       setFormData({ ...formData, [name]: value });
//     };

//     return (
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Create Patient</DialogTitle>
//         <DialogContent>
//           {/* Form fields for creating a new user */}
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//             <Grid item xs={6}>
//             <TextField
//                   label="Patient Name"
//                   fullWidth
//                   name="patient_name"
//                   value={formData.patient_name}
//                   onChange={handleChange}
//                 />
//             </Grid>
//             <Grid item xs={6}>
//             <TextField
//                   label="Mobile Number"
//                   fullWidth
//                   name="mobile_number"
//                   value={formData.mobile_number}
//                   onChange={handleChange}
//                 />
//             </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Age"
//                   fullWidth
//                   name="age"
//                   value={formData.age}
//                   onChange={handleChange}
//                 />
//               </Grid>        
//               <Grid item xs={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Gender</InputLabel>
//                   <Select
//                     value={formData.gender}
//                     onChange={handleChange}
//                     name="gender"
//                   >
//                     <MenuItem value="male">Male</MenuItem>
//                     <MenuItem value="female">Female</MenuItem>
//                     <MenuItem value="others">Others</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//             <DialogActions style={{ justifyContent: 'flex-end' }}>
//               <Button onClick={handleClose} color="secondary">Cancel</Button>
//               <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>Create</Button>
//             </DialogActions>
//           </form>
//         </DialogContent>
//       </Dialog>
//     );
//   };
//   export default CreatePatientForm;

//newcode
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../../apiConfig';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
    Grid, MenuItem, Select, FormControl, InputLabel, Switch, FormGroup, FormControlLabel
} from '@mui/material';


const CreatePatientForm = ({ open, handleClose ,setSnackOpen,setSnackAppointmentOpen,setPatientList}) => {
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    const [formData, setFormData] = useState({
        patient_name: '',
        mobile_number: '',
        age: '',
        gender: '',
        email: '',
        address: '',
        showAdditionalFields: false, // Toggle state for additional fields
        bp: '',
        temperature: '',
        weight: '',
        doctor: '',
        appointment_time: '',
        todayDate: new Date().toISOString().slice(0, 10) // Today's date
    });

    const [doctors, setDoctors] = useState([]);
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [formErrors, setFormErrors] = useState({});
 

    useEffect(() => {

        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${apiConfig.baseURL}/patient/api/doctors/`);
                setDoctors(response.data);
                setFilteredDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    // Function to fetch appointment slots for the selected doctor
    const fetchDoctorSlots = async (doctorId) => {
        try {
            const response = await axios.get(`${apiConfig.baseURL}/user/api/doctor-slots/${doctorId}/?date=${formData.todayDate}`);
            setAppointmentSlots(response.data);
        } catch (error) {
            console.error('Error fetching doctor slots:', error);
        }
    };
    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

    const errors = {};

    // Validate phone number
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.mobile_number)) {
      errors.phone_number = 'Invalid phone number (must be 10 digits)';
    }
    
    // Validate email address
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
        //   console.log(formData)
        let patientPayload = {
            patient_name: formData.patient_name,
            mobile_number: formData.mobile_number,
            age: formData.age,
            gender: formData.gender,
            email: formData.email,
            address: formData.address
        }
        console.log(patientPayload, 'pa')
        try {
            const response = await axios.post(`${apiConfig.baseURL}/patient/api/create/`, patientPayload);
            console.log(response);
            if (response.status == 201){
                setSnackOpen(true)
                window.location.reload()
                // const new_res = await axios.get(`${apiConfig.baseURL}/patient/api/create/`);
                // console.log(new_res.data)
                // setPatientList(new_res.data)
            }
            if (response.status === 201 && formData.showAdditionalFields === true) {
                console.log('with appoint')
                let payload = {
                    appointment_date: formData.todayDate,
                    patient: response.data.id,
                    doctor: formData.doctor,
                    appointment_time: formData.appointment_time
                }
                console.log(payload, 'll')
                try {
                    const response = await axios.post(`${apiConfig.baseURL}/patient/api/appointment/`, payload);
                    console.log(response);
                    setFormData({

                        patient_name: '',
                        mobile_number: '',
                        age: '',
                        gender: '',
                        email: '',
                        address: '',
                        showAdditionalFields: false, // Toggle state for additional fields
                        bp: '',
                        temperature: '',
                        weight: '',
                        doctor: '',
                        appointment_time: '',
                        todayDate: new Date().toISOString().slice(0, 10) // Today's date
                    })
                    setSelectedSlot(null)
                    setAppointmentSlots([])
                    setSnackAppointmentOpen(true)
                } catch (error) {
                    console.log(error);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        handleClose(); // Close the dialog after form submission
    };
    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setFormData({ ...formData, appointment_time: `${slot.start_time}` });
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name)
        setFormData({ ...formData, [name]: value });
        if (name === 'doctor') {
            fetchDoctorSlots(value);
        }
    };

    // Function to toggle additional fields
    const handleToggleAdditionalFields = () => {
        setFormData({ ...formData, showAdditionalFields: !formData.showAdditionalFields });
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Patient</DialogTitle>
            <DialogContent>
                {/* Form fields for creating a new user */}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Patient Name"
                                fullWidth
                                name="patient_name"
                                value={formData.patient_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Mobile Number"
                                fullWidth
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                helperText={formErrors.phone_number}
                error={!!formErrors.phone_number}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Age"
                                fullWidth
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Email"
                                fullWidth
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!formErrors.email}
                helperText={formErrors.email}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Address"
                                fullWidth
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    value={formData.gender}
                                    onChange={handleChange}
                                    name="gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="others">Others</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Additional fields */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={formData.showAdditionalFields} onChange={handleToggleAdditionalFields} />}
                                label="Today Appointment"
                            />
                        </Grid>
                        {formData.showAdditionalFields && (
                            <>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Today's Date"
                                        type="date"
                                        fullWidth
                                        name="todayDate"
                                        value={formData.todayDate}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
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
{doctor.username} - {doctor.department ? doctor.department.name : 'None'} - {doctor.qualification ? doctor.qualification.name : 'None'} - {doctor.experience? doctor.experience:"None"}                                            </MenuItem>
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
                                        name="temperature"
                                        value={formData.temperature}
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

                            </>
                        )}

                    </Grid>
                    <DialogActions style={{ justifyContent: 'flex-end' }}>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>Create</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePatientForm;
