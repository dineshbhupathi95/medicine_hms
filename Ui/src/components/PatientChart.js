import React from 'react';
import { PieChart, Pie, Tooltip, LabelList, Legend, Cell } from 'recharts';

const VisitPieChart = () => {
    const chartData = [
        { name: "Department A", value: 50 },
        { name: "Department B", value: 30 },
        { name: "Department C", value: 20 },
        { name: "Doctor X", value: 40 },
        { name: "Doctor Y", value: 25 }
    ];

    // Define a set of colors
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f0e", "#e41a1c"];

    return (
        <div style={{ height: 300, width: '100%' }}>
            <PieChart width={800} height={250}>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    fill="#8884d8" // Default color for segments
                    label
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                    <LabelList dataKey="name" position="outside" fill="#8884d8" />
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default VisitPieChart;
