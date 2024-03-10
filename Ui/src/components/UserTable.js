import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  Grid, MenuItem, Select, FormControl, InputLabel, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import { Pagination } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



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

              <TableCell>Qualification</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>OP Fee</TableCell>
              <TableCell>Address</TableCell>
              {/* <TableCell>Timings</TableCell> */}
              

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

                <TableCell>
                  {user.qualification ? user.qualification.name : 'N/A'}
                </TableCell>
                <TableCell>{user.experience}</TableCell>
                <TableCell>{user.op_fee}</TableCell>
                <TableCell>{
                `${user.road_number}-${user.street}-${user.city},${user.state},${user.country},zip_code${user.zip_code}`}
                </TableCell>
                {/* <TableCell>{`${user.start_time}-${user.end_time}`}</TableCell> */}

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
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    department: '',
    role: '',
    qualification:'',
    experience: '',
    op_fee: '',
    road_number: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    day_time_availability: '',
    signature: '',
    start_time: '00:00:00',
    end_time: '00:00:00'
  });

  const [showPassword, setShowPassword] = useState(false);

  // Validation error messages
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [filterDepartments, setFilterDepartments] = useState([])
  const [filterQualification, setFilterQualification] = useState([])
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseURL}/user/api/department/`);
        setFilterDepartments(response.data)
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    const fetchQualification = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseURL}/user/api/qualification/`);
        setFilterQualification(response.data)
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments()
    fetchQualification()
  }, [])
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate required fields
    const requiredFields = ['username', 'email', 'phone_number', 'password'];
    const errors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'Required';
      }
    });

    // Validate phone number
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.phone_number)) {
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

    // Add logic to submit form data to the server
    try {
      const response = await axios.post(`${apiConfig.baseURL}/user/api/create/`, formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    handleClose(); // Close the dialog after form submission
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Check if the field is the phone number
    if (name === 'phone_number') {
      // Remove any non-digit characters from the input value
      const phoneNumber = value.replace(/\D/g, '');
      // Check if the phone number length exceeds 10 digits
      if (phoneNumber.length > 10) {
        // Do not update state if phone number length exceeds 10 digits
        return;
      }
      // Update the state with the cleaned phone number
      setFormData({ ...formData, [name]: phoneNumber });
    } else {
      // For other fields, update the state as usual
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
            <Grid item xs={6}>
              <TextField
                select
                label="Department"
                fullWidth
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                {filterDepartments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
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
                error={!!formErrors.username}
                helperText={formErrors.username}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Mobile Number"
                fullWidth
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                helperText={formErrors.phone_number}
                error={!!formErrors.phone_number}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Password"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required
              />
            </Grid>
            {/* Department and Role fields */}


            {formData.role === 'doctor' && (
              <>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Qualification"
                    fullWidth
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                  >
                    {filterQualification.map((qualification) => (
                      <MenuItem key={qualification.id} value={qualification.id}>
                        {qualification.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Experience"
                    fullWidth
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="OP Fee"
                    fullWidth
                    name="op_fee"
                    value={formData.op_fee}
                    onChange={handleChange}
                  />
                </Grid>


                <Grid item xs={6}>
                  <TextField
                    label="Road Number"
                    fullWidth
                    name="road_number"
                    value={formData.road_number}
                    onChange={handleChange}
                  />
                </Grid>


                <Grid item xs={6}>
                  <TextField
                    label="Street"
                    fullWidth
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                  />
                </Grid>


                <Grid item xs={6}>
                  <TextField
                    label="City"
                    fullWidth
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="State"
                    fullWidth
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Zip Code"
                    fullWidth
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Country"
                    fullWidth
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Day Wise Time Availabilty"
                    fullWidth
                    name="day_time_availability"
                    value={formData.day_time_availability}
                    onChange={handleChange}
                  />
                </Grid>


                <Grid item xs={6}>
                  <TextField
                    label="Signature"
                    fullWidth
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Start Time"
                    fullWidth
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="End Time"
                    fullWidth
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

          </Grid>
          <DialogActions style={{ justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Create</Button>
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
