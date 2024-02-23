import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Medimind
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

function LoginPage() {
  const [open, setOpen] = React.useState(false);
  const [loggedIn,setLoggedIn] = React.useState(false)
  const navigate = useNavigate()
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  React.useEffect(() => {
    // Check if the user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      setLoggedIn(true);
      navigate("/")
      
    }else{
      navigate("/login")
    }
  }, []); 
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    try {
      const response = await axios.post(`${apiConfig.baseURL}/user/api/login/`, {
          username: data.get('email'),
          password: data.get('password')
      });
      localStorage.setItem('user', JSON.stringify({
        loggedIn: true,
        id: response.data.id,
        username: response.data.username,
        role: response.data.role
      }));
  
      // Redirect to /doctor after successful login
      // console.log("Redirecting to /doctor");
      if (response.data.role == 'admin'){
        // navigate('/')
window.location.href = '/'
      }
      if (response.data.role == 'doctor'){
      // navigate('/doctor');
      window.location.href = '/doctor'
    }
  } catch (error) {
    setOpen(true)
      console.error('Login error:', error);
      // Handle login error, e.g., display error message
  }
    setLoggedIn(true);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="username"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              {/* <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            </Grid>
          </Box>
          <Snackbar
           anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Set anchor origin to top right
           open={open} autoHideDuration={6000} onClose={handleClose}
           style={{ marginTop: '64px' }} // Adjust margin from the top

           >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%'}}
        >
          Invalid User Credintials
        </Alert>
      </Snackbar>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;