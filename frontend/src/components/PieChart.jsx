import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './dashboardStyle.css'
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({totalEmissionTypeWise}) => {
  const data = Object.entries(totalEmissionTypeWise).map(([type, totalEmission]) => ({
    type,
    totalEmission
  }));

  const types = data.map(item => item.type);
  const emissions = data.map(item => item.totalEmission);

  const visualizeData = {
    labels: types,
    color: 'white',
    datasets: [{
      data: emissions,
      color: 'white',
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)', 
        'rgba(54, 162, 235, 0.2)', 
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)', 
        'rgba(54, 162, 235, 1)', 
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1,
    }],
  }

  const options = {
    maintainAspectRatio: false, // Allows for custom aspect ratio
    aspectRatio: 1, // Adjusts the size, lower values make the chart smaller
    plugins: {
      legend: {
        labels: {
          color: 'white', // Set legend label color to white
        },
      },
      tooltip: {
        titleColor: 'white', // Tooltip title color
        bodyColor: 'white', // Tooltip body text color
      }
    }
  };

  return (
    
    <div style={{ width: '300px', height: '300px' }}>
        
        <Pie data={visualizeData} options={options} />
    </div>
  )
}
