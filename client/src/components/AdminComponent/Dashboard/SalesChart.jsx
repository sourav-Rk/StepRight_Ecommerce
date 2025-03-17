import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesBarChart = ({ salesData }) => {
  const chartData = {
    labels: salesData?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: salesData?.map(item => item.revenue) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
      {
        label: 'Orders',
        data: salesData?.map(item => item.orders) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Performance',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default SalesBarChart;
