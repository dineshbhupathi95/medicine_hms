import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseURL}/user/api/department/`);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (newDepartment.trim() === '') {
      alert('Please enter a department name.');
      return;
    }

    try {
      await axios.post(`${apiConfig.baseURL}/user/api/department/`, { name: newDepartment });
      const response = await axios.get(`${apiConfig.baseURL}/user/api/department/`);
      setDepartments(response.data);
      setNewDepartment('');
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  return (
    <div>
      <h2>Department List</h2>
      <TextField
        label="Enter department name"
        variant="outlined"
        value={newDepartment}
        onChange={(e) => setNewDepartment(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddDepartment}
        style={{ marginBottom: '10px' }}
      >
        Add Department
      </Button>

      {departments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Department Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No departments added yet.</p>
      )}
    </div>
  );
};

export default DepartmentList;
