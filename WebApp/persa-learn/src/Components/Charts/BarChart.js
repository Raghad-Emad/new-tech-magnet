import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as Charts } from "chart.js/auto";

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const BarChart = ({ chartData }) => {
  if (chartData == null || chartData.length == 0) return <></>;

  return <Bar options={options} data={chartData} />;
};

export default BarChart;
