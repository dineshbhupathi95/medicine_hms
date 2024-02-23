import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Grid, css } from '@mui/material';
import { Pagination } from '@mui/material';
import apiConfig from '../../apiConfig';

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
console.log(paginatedPatients,'pagepatients')
  return (
    <div>
      <TextField
        label="Search"
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
              <TableCell>Appointment Time</TableCell>
              {/* <TableCell>Actions</TableCell>  */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                <Link to={`/patient-history/${patient.patient.id}`}>{patient.patient.patient_id}</Link>
                    
                    </TableCell>
                <TableCell>{patient.patient.patient_name}</TableCell>
                <TableCell>{patient.patient.mobile_number}</TableCell>
                <TableCell>{patient.patient.age ? patient.patient.age : 'N/A'}</TableCell>
                <TableCell>{patient.patient.gender ? patient.patient.gender : 'N/A'}</TableCell>
                <TableCell>{patient.appointment_time ? patient.appointment_time : 'N/A'}</TableCell>

                {/* <TableCell>
                  <Link to={`/patient-history/${patient.patient.id}`}>View Details</Link>
                </TableCell> */}
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
const getFormattedDate = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = currentDate.getFullYear();
    return `${year}-${month}-${day}`;
  };
const DoctorDashboard = () => {
    // alert('jj')
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [filterDate, setFilterDate] = useState(getFormattedDate()); // Initialize filterDate with current date


  useEffect(() => {
    getPatientData(getFormattedDate());
  }, []);

  

  const getPatientData = async (currentDate) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      let doctorId = user.id;
    //   const currentDate = getFormattedDate(); // Get the formatted current date
      let url = `${apiConfig.baseURL}/patient/api/doctor/${doctorId}/patients/?appointment_date=${currentDate}`;
    //   console.log(url);
      const response = await axios.get(url, {});
      
      setAssignedPatients(response.data);
    } catch (error) {
      console.error('error:', error);
    }
  };
  const handleDateChange = (event) =>{
        setFilterDate(event.target.value)
        getPatientData(event.target.value)
  }

  return (
    <div>
      <h2>Assigned Patients on {filterDate}</h2>
      <Grid container justifyContent="flex-end" sx={{ marginBottom: 2}}>
        <Grid item>
          <TextField
            label="Filter by Date"
            type="date"
            value={filterDate}
            onChange={handleDateChange} // Call handleDateChange when the date changes
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: 200 }} // Custom width for the TextField

          />
        </Grid>
      </Grid>
      <PatientList patientList={assignedPatients} />
    </div>
  );
};

export default DoctorDashboard;
