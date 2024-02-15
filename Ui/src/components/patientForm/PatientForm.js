import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../../apiConfig';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, 
  Grid, MenuItem, Select, FormControl, InputLabel,TableContainer,Paper,Table,TableHead,TableRow,TableCell,TableBody } from '@mui/material';


const CreatePatientForm = ({ open, handleClose }) => {
    const [formData, setFormData] = useState({
        patient_name:'',
        mobile_number:'',
        age: '',
        gender: '',
    });
  
    // Function to handle form submission
    const handleSubmit = async (event) => {
      console.log(formData)
      event.preventDefault();
      try{
        const response = await axios.post(`${apiConfig.baseURL}/patient/api/create/`, formData);
        console.log(response)
      }
      catch(error){
        console.log(error)
      }
      handleClose(); // Close the dialog after form submission
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      console.log(event.target)
      setFormData({ ...formData, [name]: value });
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