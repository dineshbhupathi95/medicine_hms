import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip
} from '@mui/material';

const CampaignComponent = () => {
  const campaigns = [
    {
      id: 1,
      title: 'Diabetes Checkup',
      description: 'Get free sugar test this weekend',
      status: 'Active',
      audience: 1200
    },
    {
      id: 2,
      title: 'Heart Health Camp',
      description: 'Discount on ECG & consultation',
      status: 'Scheduled',
      audience: 800
    },
    {
      id: 3,
      title: 'Vaccination Drive',
      description: 'Flu shots available for all age groups',
      status: 'Completed',
      audience: 500
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Scheduled':
        return 'warning';
      case 'Completed':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Campaigns
        </Typography>

        <Button variant="contained">
          + Create Campaign
        </Button>
      </Box>

      {/* Campaign Cards */}
      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} sm={6} md={4} key={campaign.id}>
            <Card
              sx={{
                borderRadius: 3,
                height: '100%',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {campaign.title}
                  </Typography>

                  <Chip
                    label={campaign.status}
                    color={getStatusColor(campaign.status)}
                    size="small"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={2}
                >
                  {campaign.description}
                </Typography>

                <Typography variant="body2">
                  👥 Audience: <b>{campaign.audience}</b>
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button size="small">View</Button>
                <Button size="small">Edit</Button>
                <Button size="small" color="error">
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CampaignComponent;