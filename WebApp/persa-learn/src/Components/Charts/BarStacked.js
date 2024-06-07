import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as Charts } from "chart.js/auto";

const options = {
  //   plugins: {
  //     // title: {
  //     //   display: true,
  //     //   //   text: "Chart.js Bar Chart - Stacked",
  //     // },
  //   },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const BarStacked = ({ chartData }) => {
  if (chartData == null || chartData.length == 0) return <></>;
  return <Bar data={chartData} options={options} />;
};

export default BarStacked;
