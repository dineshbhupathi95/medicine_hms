import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../static/images/med.jpeg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../apiConfig';


function TopBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate() 

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    // Implement profile click logic
    handleMenuClose();
  };

  const handleLogoutClick =  async() => {
    // Implement logout click logic
    try {
      const response = await axios.post(`${apiConfig.baseURL}/user/api/logout/`, {
      });
      console.log(response)
      localStorage.removeItem('user')
      window.location.href = '/'; //Will take you to Google.
      // Handle successful login, e.g., redirect to dashboard
  } catch (error) {
      console.error('Login error:', error);
      // Handle login error, e.g., display error message
  }
    handleMenuClose();

  };

  return (
    <AppBar position="fixed" style={{backgroundColor:"#02184d"}}>
      <Toolbar>
        {/* Display logo image */}
        <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MediMind
        </Typography>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
