import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';


const PrescriptionDialog = ({ prescription, onClose,onOpen }) => {
    const [open, setOpen] = useState(onOpen);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      onClose(); // Call onClose function to perform any necessary cleanup or actions
    };
  
    return (
      <>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Prescription</DialogTitle>
          <DialogContent>
            <Typography>{prescription}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  export default PrescriptionDialog;