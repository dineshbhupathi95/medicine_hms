// import React, { useEffect, useState } from 'react';
// import { PieChart, Pie, Tooltip, LabelList, Legend, Cell } from 'recharts';
// import axios from 'axios';
// import apiConfig from '../apiConfig';
// import { TextField } from '@mui/material';

// const VisitPieChart = (props) => {
//     const [chartData, setChartData] = useState([])
//     const [filterDate,setFilterDate] = useState()
//     // Define a set of colors
//     const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f0e", "#e41a1c"];
//     useEffect(()=>{
//         getDashboardData(props.date)
//     },[])

//     const getDashboardData = async (date) =>{
//         try{
//             const response = await axios.get(`${apiConfig.baseURL}/patient/api/dashboard/?date=${date}`);
//             if (response.status == 200){
//                 setChartData(response.data.dashboard_counts)
//             }
            
//         }catch{

//         }
//     }

//     const handleDateChange = (event) =>{
//             setFilterDate(event.target.value)
//             getDashboardData(event.target.value)
//     }
//     return (
//         <div style={{ height: 300, width: '100%' }}>
//             <TextField
//             label="Filter by Date"
//             type="date"
//             value={filterDate}
//             onChange={handleDateChange} // Call handleDateChange when the date changes
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{ width: 200 }} // Custom width for the TextField

//           />
//             <PieChart width={800} height={200}>
//                 <Pie
//                     data={chartData}
//                     dataKey="value"
//                     nameKey="name"
//                     fill="#8884d8" // Default color for segments
//                     label
//                 >
//                     {chartData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//                     ))}
//                     <LabelList dataKey="name" position="outside" fill="#8884d8" />
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//             </PieChart>
//         </div>
//     );
// };

// export default VisitPieChart;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { TextField, Typography, Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

const DonutChart = ({ data }) => {
    const chartOptions = {
        labels: data.map(item => item.label),
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '22px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  color: undefined,
                  offsetY: -10
                },
                value: {
                  show: 'hover', // Show value on hover
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  color: undefined,
                  offsetY: 16,
                  formatter: function (val) {
                    return val;
                  }
                },
                
    chart: {
      width: 600 || '100%',
      height: 500 || 'auto',
      type: 'donut'
    },
                // total: {
                //   show: true,
                //   label: 'Total',
                //   color: '#373d3f',
                //   formatter: function (w) {
                //     return w.globals.seriesTotals.reduce((a, b) => {
                //       return a + b;
                //     }, 0);
                //   }
                // }
              }
            }
          }
        }
      };
    

  const chartSeries = data.map(item => item.value);

  return (
    <div>
      <ReactApexChart options={chartOptions} series={chartSeries} type="donut" />
    </div>
  );
};



export default function DonutActiveArc() {
    const [data, setData] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardData('');
    }, []);

    const getDashboardData = async (date) => {
        try {
            const response = await axios.get(`${apiConfig.baseURL}/patient/api/dashboard/?date=${date}`);
            console.log(response.data.dashboard_counts)
            if (response.status === 200) {
                setData(response.data.dashboard_counts);
            }
            setLoading(false); // Set loading to false once data is fetched
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); // Set loading to false in case of an error
        }
    };

    const handleDateChange = (event) => {
        const { value } = event.target;
        setFilterDate(value);
        setLoading(true); // Set loading to true when date changes to indicate loading state
        getDashboardData(value);
    };

    return (
        <>
            <TextField
                label="Filter by Date"
                type="date"
                value={filterDate}
                onChange={handleDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{ width: 200 }}
            />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={200} // Adjust height as needed
            >
                {loading ? (
                    <Typography variant="body1">Loading...</Typography>
                ) : data.length === 0 ? (
                    <Typography variant="body1">No data found.</Typography>
                ) : (
                    // <PieChart
                    //     series={[
                    //         {
                    //             data,
                    //             highlightScope: { faded: 'global', highlighted: 'item' },
                    //             faded: { innerRadius: '40%', outerRadius: '70%', color: 'gray' }, // Adjust innerRadius and outerRadius for donut appearance
                    //         },
                    //     ]}
                    //     height={200}
                    // />
                    <DonutChart data={data}/>
                )}
            </Box>
        </>
    );
}
