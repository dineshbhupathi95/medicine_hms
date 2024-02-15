import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, 
  Grid, MenuItem, Select, FormControl, InputLabel,TableContainer,Paper,Table,TableHead,TableRow,TableCell,TableBody } from '@mui/material';
import { Pagination } from '@mui/material';



const UserList = ({ userList }) => {
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

  const filteredUsers = userList.filter((user) => {
    return Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    );
  });

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>
        {user.department ? user.department.name : 'N/A'}
      </TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(filteredUsers.length / rowsPerPage)}
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

const CreateUserForm = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    first_name:'',
    last_name:'',
    username: '',
    email: '',
    phone_number:'',
    password: '',
    department:'',
    role: ''
  });

  // Function to handle form submission
  const handleSubmit = async (event) => {
    console.log(formData)
    event.preventDefault();
    // Add logic to submit form data to the server
    try{
      const response = await axios.post(`${apiConfig.baseURL}/user/api/create/`, formData);
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
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        {/* Form fields for creating a new user */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
          <Grid item xs={6}>
          <TextField
                label="First Name"
                fullWidth
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
          </Grid>
          <Grid item xs={6}>
          <TextField
                label="Last Name"
                fullWidth
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
          </Grid>
            <Grid item xs={6}>
              <TextField
                label="Username"
                fullWidth
                name="username"
                value={formData.username}
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
              />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Mobile Number"
                fullWidth
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Password"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Department"
                fullWidth
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={handleChange}
                  name="role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="branch_manager">Branch Manager</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="patients">Patients</MenuItem>
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

// const CreateUserButton = () => {
//   // Handle click event to open create user form or dialog
//   return <Button variant="contained" color="primary">Create New User</Button>;
// };

const UserManagementPage = () => {
  const [userList, setUserList] = useState([])
  const [open, setOpen] = useState(false); // State to control dialog visibility

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/user/api/create/`, {
      });
      setUserList(response.data)
      console.log(response.data)

    } catch (error) {
      console.error('Login error:', error);

    }
  }
  const handleCreateUserClick = () => {
    setOpen(true); // Open the dialog when "Create New User" button is clicked
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };
  // const userList = [
  //   { id: 1, username: 'JohnDoe', email: 'john.doe@example.com', role: 'admin' },
  //   ];


  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} align="right"> 
          <Button variant="contained" color="primary" onClick={handleCreateUserClick}>Create New User</Button>
        </Grid>
        <Grid item xs={12}>
          <UserList userList={userList} />
        </Grid>
      </Grid>
      <CreateUserForm open={open} handleClose={handleClose} /> {/* Render the CreateUserForm component */}
    </div>
  );
};

export default UserManagementPage;
