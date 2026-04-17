import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  Grid, MenuItem, Select, FormControl, InputLabel, TableContainer, Paper,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton,
  InputAdornment, Chip, Typography, Box, Pagination, Stack, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';

// ── Components ──────────────────────────────────────────────────────────────

const UserList = ({ userList }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');

  const handleChangePage = (event, newPage) => setPage(newPage);

  const filteredUsers = userList.filter((user) => {
    return Object.values(user).some((value) =>
      value ? value.toString().toLowerCase().includes(filter.toLowerCase()) : false
    );
  });

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  // Helper for role color
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'error';
      case 'doctor': return 'primary';
      case 'staff': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Modern Search Bar */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search users..."
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ width: 350, bgcolor: 'white' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="body2" color="textSecondary">
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>User Details</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Professional</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: 'primary.light' }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{user.username}</Typography>
                      <Typography variant="caption" color="textSecondary">{user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                   <Typography variant="body2">{user.department ? user.department.name : 'N/A'}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    size="small"
                    color={getRoleColor(user.role)}
                    variant="soft" // Note: soft variant requires custom theme or use light colors
                    sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{user.qualification?.name || 'No Degree'}</Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      Exp: {user.experience || 0} Years • Fee: ₹{user.op_fee || 0}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="caption" color="textSecondary" noWrap title={`${user.city}, ${user.state}`}>
                    {`${user.street || ''}, ${user.city || ''}, ${user.zip_code || ''}`}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
        <Pagination
          count={Math.ceil(filteredUsers.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          shape="rounded"
        />
      </Stack>
    </Box>
  );
};

const CreateUserForm = ({ open, setSnackOpen, handleClose }) => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', email: '',
    phone_number: '', password: '', department: '', role: '',
    qualification: null, experience: '', op_fee: '',
    road_number: '', street: '', city: '', state: '',
    zip_code: '', country: '', day_time_availability: '',
    signature: '', start_time: '09:00', end_time: '17:00'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [filterDepartments, setFilterDepartments] = useState([]);
  const [filterQualification, setFilterQualification] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, qualRes] = await Promise.all([
          axios.get(`${apiConfig.baseURL}/user/api/department/`),
          axios.get(`${apiConfig.baseURL}/user/api/qualification/`)
        ]);
        setFilterDepartments(deptRes.data);
        setFilterQualification(qualRes.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    if(open) fetchData();
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!formData.username) errors.username = 'Required';
    if (!formData.email.includes('@')) errors.email = 'Invalid email';
    if (formData.phone_number.length !== 10) errors.phone_number = '10 digits required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post(`${apiConfig.baseURL}/user/api/create/`, formData);
      if (response.status === 201) setSnackOpen(true);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone_number') {
      const val = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: val });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
        Add New User Profile
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>System Role</InputLabel>
              <Select label="System Role" value={formData.role} onChange={handleChange} name="role">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="branch_manager">Branch Manager</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select label="Department" fullWidth size="small"
              name="department" value={formData.department} onChange={handleChange}
            >
              {filterDepartments.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}><TextField label="First Name" fullWidth size="small" name="first_name" onChange={handleChange}/></Grid>
          <Grid item xs={12} sm={6}><TextField label="Last Name" fullWidth size="small" name="last_name" onChange={handleChange}/></Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Username" fullWidth size="small" name="username" error={!!formErrors.username} helperText={formErrors.username} onChange={handleChange} required/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Email" fullWidth size="small" name="email" error={!!formErrors.email} helperText={formErrors.email} onChange={handleChange} required/>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Mobile Number" fullWidth size="small" name="phone_number" error={!!formErrors.phone_number} helperText={formErrors.phone_number} value={formData.phone_number} onChange={handleChange} required/>
          </Grid>

          {formData.role === 'doctor' && (
            <>
              <Grid item xs={12}><Typography variant="button" color="primary">Doctor Details</Typography></Grid>
              <Grid item xs={6}>
                <TextField select label="Qualification" fullWidth size="small" name="qualification" value={formData.qualification} onChange={handleChange}>
                  {filterQualification.map((q) => <MenuItem key={q.id} value={q.id}>{q.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={3}><TextField label="Experience" fullWidth size="small" name="experience" onChange={handleChange}/></Grid>
              <Grid item xs={3}><TextField label="OP Fee" fullWidth size="small" name="op_fee" onChange={handleChange}/></Grid>
              <Grid item xs={4}><TextField label="City" fullWidth size="small" name="city" onChange={handleChange}/></Grid>
              <Grid item xs={4}><TextField label="State" fullWidth size="small" name="state" onChange={handleChange}/></Grid>
              <Grid item xs={4}><TextField label="Zip" fullWidth size="small" name="zip_code" onChange={handleChange}/></Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid #eee' }}>
        <Button onClick={handleClose} color="inherit">Discard</Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation>Save User</Button>
      </DialogActions>
    </Dialog>
  );
};

const UserManagementPage = () => {
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => { getUserData(); }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/user/api/create/`);
      setUserList(response.data);
    } catch (error) { console.error('Data fetch error:', error); }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>User Management</Typography>
            <Typography variant="body2" color="textSecondary">Manage system users, doctors, and staff roles.</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Create New User
          </Button>
        </Grid>

        <Grid item xs={12}>
          <UserList userList={userList} />
        </Grid>
      </Grid>

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        message="User created successfully"
      />
      <CreateUserForm open={open} setSnackOpen={setSnackOpen} handleClose={() => setOpen(false)} />
    </Box>
  );
};

export default UserManagementPage;