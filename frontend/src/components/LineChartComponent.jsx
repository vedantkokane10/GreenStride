import { Line } from "react-chartjs-2";
import './dashboardStyle.css'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartComponent = ({ totalEmissionDateWise }) => {
  // Convert the totalEmissionDateWise object to an array of objects
  const data = Object.entries(totalEmissionDateWise).map(([date, totalEmission]) => ({
    date,
    totalEmission
  }));

  // Extract the dates and emissions separately
  const dates = data.map(item => item.date);
  const emissions = data.map(item => item.totalEmission);
  dates.reverse();
  emissions.reverse();
  const dataVisualize = {
    labels: dates,  // Use the extracted dates here
    datasets: [
      {
        label: "CO2 Emissions",
        data: emissions,  // Use the extracted emissions here
        fill: false,
        borderColor: "black",
        backgroundColor: "black"
      }
    ]
  };

  const options = {
    scales:{
      x:{
        title:{
          display: true,
          text: "Date",
          color: 'black'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.5)'
          // color: 'rgba(255, 255, 255, 0.1)', // Lighter grid lines
        },
        ticks: {
          color: 'black', // Set the color of the tick labels
        },
        // backgroundColor: 'white',
      },
      y:{
        title:{
          display:true,
          text: "Total CO2 Emissions (kg)",
          color: 'black'
        },
        grid: {
          // color: 'black'
          color: 'rgba(0, 0, 0, 0.2)'
          // color: 'rgba(255, 255, 255, 0.1)', // Lighter grid lines
        },
        ticks: {
          color: 'black', // Set the color of the tick labels
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'black', // Set the color of the legend text
        },
      },
    },
  };

  return (
    <div style={{ width: '1000px', height: '500px', align:"center" }}>
      <h2 style={{color:"black"}}>Total CO2 Emissions by Date</h2>
      <Line data={dataVisualize} options={options} />
    </div>
  );
};

export default LineChartComponent;
