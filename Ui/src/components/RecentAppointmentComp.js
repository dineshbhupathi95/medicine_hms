import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import axios from 'axios';
import apiConfig from '../apiConfig';

// // Generate Order Data
// function createData(id, date, name, visit_dep, visit_doc,paymentMethod) {
//   return { id, date, name, visit_dep, visit_doc,paymentMethod };
// }

// const rows = [
//   createData(
//     0,
//     '16 Mar, 2019',
//     'Elvis Presley',
//     'Neurology',
//     'Ramans',
//     'VISA ⠀•••• 3719',
    
//   ),
//   createData(
//     1,
//     '16 Mar, 2019',
//     'Paul McCartney',
//     'pulmology',
//     'andrez',
//     'VISA ⠀•••• 2574',
//   ),
//   createData(2, '16 Mar, 2019', 'Tom Scholz', 'cardiology', 'karol','MC ⠀•••• 1253'),
//   createData(
//     3,
//     '16 Mar, 2019',
//     'Michael Jackson',
//     'Neurology',
//     'paul',
//     'AMEX ⠀•••• 2000',
//   ),
// //   createData(
// //     4,
// //     '15 Mar, 2019',
// //     'Bruce Springsteen',
// //     'Long Branch, NJ',
// //     'VISA ⠀•••• 5919',
// //     212.79,
// //   ),
// ];

// function preventDefault(event) {
//   event.preventDefault();
// }

export default function RecentAppointments() {
  const [appointmentRows, setAppointmentRows] = React.useState([])

  React.useEffect(()=>{
    getAppointments()
  },[])

  const getAppointments = async () =>{
    try{
      const response = await axios.get(`${apiConfig.baseURL}/patient/api/recent-appointment/`);
      console.log(response)
      setAppointmentRows(response.data)
    }
    catch(error){
      console.log(error)
    }

  }
    return (
    <React.Fragment>
      <Title>Recent Appointments</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Visiting Time</TableCell>
            <TableCell>visiting Department</TableCell>
            <TableCell>visiting Doctor</TableCell>
            {/* <TableCell align="right">Payment Method</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {appointmentRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.appointment_date}</TableCell>
              <TableCell>{row.patient.patient_name}</TableCell>
              <TableCell>{row.appointment_time}</TableCell>
              <TableCell>{row.doctor.department.name}</TableCell>
              <TableCell>{row.doctor.username}</TableCell>
              {/* <TableCell align="right">{row.paymentMethod}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more Appointments
      </Link> */}
    </React.Fragment>
  );
}