import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem
} from '@mui/material';

import BasicBars from '../components/Barchart';
import BasicPie from '../components/Piechart';
import '../css/report-styles.css';

const stats = [
  { title: 'Total Patients', value: '1,245' },
  { title: 'Appointments Today', value: '86' },
  { title: 'Revenue Today', value: '₹1.2L' },
  { title: 'Bed Occupancy', value: '78%' },
];

function Report() {
  return (
    <Box className="report" p={3}>

      {/* 🔷 Filters */}
      <Box mb={3} display="flex" gap={2}>
        <TextField select label="Time Range" size="small">
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </TextField>

        <TextField label="Department" size="small" />
        <TextField label="Doctor" size="small" />
      </Box>

      {/* 🔷 KPI Cards */}
      <Grid container spacing={2} mb={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="subtitle2" color="textSecondary">
                {item.title}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 🔷 Charts Section */}
      <Grid container spacing={2}>

        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Patients by Department</Typography>
            <BasicBars />
          </Paper>
        </Grid>

        {/* Right Side Charts */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h6">Patient Distribution</Typography>
            <BasicPie />
          </Paper>

          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Revenue Trend</Typography>
            {/* Add LineChart here */}
          </Paper>
        </Grid>
      </Grid>

      {/* 🔷 Table Section */}
      <Box mt={3}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Typography variant="h6">Recent Patients</Typography>
          {/* Add Table here */}
        </Paper>
      </Box>

    </Box>
  );
}

export default Report;