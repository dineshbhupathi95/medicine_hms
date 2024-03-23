import React, { useState,useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Grid, css } from '@mui/material';
import { Pagination } from '@mui/material';
import apiConfig from '../apiConfig';
import axios from 'axios';
import CreatePatientForm from './patientForm/PatientForm';
import AppointmentScheduleDialog from './patientForm/AppointmentDialog';
import TopBar from './Topbar';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Snackbar from '@mui/material/Snackbar';

const PatientList = ({ patientList }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const filteredPatients = patientList.filter((patient) => {
    // console.log(patient, 'lll');
    return Object.values(patient).some((value) => {
        if (value === null || value === undefined || typeof value === 'number') {
            return false; // Skip null, undefined, or numeric values
        }
        return value.toString().toLowerCase().includes(filter.toLowerCase());
    });
});


  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  return (
    <div>
      <TextField
        label="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              {/* <TableCell>Details</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  {/* {patient.patient_id} */}
                  <Link to={`/patient-history/${patient.id}`}>{patient.patient_id}</Link>
                  </TableCell>
                
                <TableCell>{patient.patient_name}</TableCell>
                <TableCell>{patient.mobile_number}</TableCell>
                <TableCell>
                  {patient.age ? patient.age: 'N/A'}
                  </TableCell>
                <TableCell>
                  {patient.gender ? patient.gender : 'N/A'}
                  </TableCell>
                {/* <TableCell>{patient.details}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(filteredPatients.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

const PatientTable = () => {
  const [patientList, setPatientList] = useState([])
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [appointmentOpen,setAppointmentOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackAppointmentOpen,setSnackAppointmentOpen] = useState(false)

  useEffect(() => {
    getPatientData()
  }, [])

  const getPatientData = async () => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/patient/api/create/`, {
      });
      setPatientList(response.data)
      console.log(response.data)

    } catch (error) {
      console.error('Login error:', error);

    }
  }
  const handleCreateUserClick = () => {
    setOpen(true); // Open the dialog when "Create New User" button is clicked
  };

  const handleClose = () => {
    setOpen(false); 
    setAppointmentOpen(false)
  };
  const handleAppointmentClick = () =>{
    setAppointmentOpen(true)
  }
  const handlePatientCreated = (newPatient) => {
    console.log(newPatient)
    // Update the patient list in the parent component with the new patient
    setPatientList(newPatient);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackAppointmentOpen(false)
    setSnackOpen(false);
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} align="right"> 
          <Button variant="contained" color="primary" onClick={handleCreateUserClick}>Create Patient</Button>
          <Button variant="contained" color="primary" onClick={handleAppointmentClick} style={{marginLeft:'10px'}}>Schedule Appointment</Button>
        </Grid>
        <Grid item xs={12}>
          <PatientList patientList={patientList} />
        </Grid>
      </Grid>
      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={handleSnackClose}
        message="Patient created successfully."
      />
      <Snackbar
        open={snackAppointmentOpen}
        autoHideDuration={5000}
        onClose={handleSnackClose}
        message="Appointment Scheduled."
      />
      <AppointmentScheduleDialog open={appointmentOpen} setSnackAppointmentOpen={setSnackAppointmentOpen} handleClose={handleClose} /> 
      <CreatePatientForm open={open} handleClose={handleClose} setSnackOpen={setSnackOpen} setSnackAppointmentOpen={setSnackAppointmentOpen} setPatientList={handlePatientCreated} /> 
    </div>
  );
};

export default PatientTable;
