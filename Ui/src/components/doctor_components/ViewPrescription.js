import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const PrescriptionDialog = ({ prescription, onClose, onOpen }) => {
    const [open, setOpen] = useState(onOpen);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      onClose(); // Call onClose function to perform any necessary cleanup or actions
    };
  
    const handleSendEmail = () => {
      // Implement send email function
      console.log('Sending email...');
    };
  
    const handleSendSMS = () => {
      // Implement send SMS function
      console.log('Sending SMS...');
    };
  
    const handleSendWhatsApp = () => {
      // Implement send WhatsApp function
      console.log('Sending WhatsApp message...');
    };
  
    return (
      <>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Prescription</DialogTitle>
          <DialogContent>
            <Typography>{prescription}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSendEmail} color="primary" startIcon={<EmailIcon />}>
              Email
            </Button>
            <Button onClick={handleSendSMS} color="primary" startIcon={<SmsIcon />}>
              SMS
            </Button>
            <Button onClick={handleSendWhatsApp} color="primary" startIcon={<WhatsAppIcon />}>
              WhatsApp
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
};

export default PrescriptionDialog;
