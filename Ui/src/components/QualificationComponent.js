import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const QualificationList = () => {
  const [qualification, setQualification] = useState([]);
  const [newQualification, setNewQualification] = useState('');

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseURL}/user/api/qualification/`);
        setQualification(response.data);
      } catch (error) {
        console.error('Error fetching qualificaion:', error);
      }
    };

    fetchQualifications();
  }, []);

  const handleQualification = async () => {
    if (newQualification.trim() === '') {
      alert('Please enter a department name.');
      return;
    }

    try {
      await axios.post(`${apiConfig.baseURL}/user/api/qualification/`, { name: newQualification });
      const response = await axios.get(`${apiConfig.baseURL}/user/api/qualification/`);
      setQualification(response.data);
      setNewQualification('');
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  return (
    <div>
      <h2>Qualification List</h2>
      <TextField
        label="Enter Qualification Name"
        variant="outlined"
        value={newQualification}
        onChange={(e) => setNewQualification(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleQualification}
        style={{ marginBottom: '10px' }}
      >
        Add Qualification
      </Button>

      {qualification.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Qualification Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qualification.map((qualificaion) => (
                <TableRow key={qualificaion.id}>
                  <TableCell>{qualificaion.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No Qualification added yet.</p>
      )}
    </div>
  );
};

export default QualificationList;
