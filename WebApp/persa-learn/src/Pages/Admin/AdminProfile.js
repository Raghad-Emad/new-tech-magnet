import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../Components/CustomButton";
import LineChar from "../../Components/Charts/LineChar";
import { getMonthlySignups } from "../../http_Requests/StatsRequest";
import styles from "./AdminProfile.module.css";

const userData = [
  { id: 1, year: 2016, userGain: 8000, userLost: 823 },
  { id: 2, year: 2017, userGain: 4000, userLost: 900 },
  { id: 3, year: 2018, userGain: 10000, userLost: 2023 },
];

const AdminProfile = () => {
  const navigate = useNavigate();
  const [monthlySignups, setMonthlySignups] = useState([]);

  useEffect(async () => {
    const data = await getMonthlySignups();
    console.log(data);
    setMonthlySignups(data.data);
    console.log(monthlySignups.map((mon) => mon.Month));
  }, []);

  return (
    <div className="content-box">
      <h1>Admin Profile</h1>
      <div className={styles.container}>
        <h2>Stats</h2>
        <div className={styles.statistics}>
          <div className={styles.sign_ups}>
            <h3>Monthly Sign Ups</h3>
            <LineChar
              chartData={{
                labels: monthlySignups.map((mon) => mon.Month),
                datasets: [
                  {
                    label: "Student Sign Ups",
                    data: monthlySignups.map((mon) => mon.Num),
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgb(75, 192, 192,0.2)",
                    tension: 0.1,
                    fill: "start",
                  },
                ],
              }}
            />
          </div>
          <div className={styles.users}>
            <h3>Total students</h3>
            <LineChar
              chartData={{
                labels: monthlySignups.map((mon) => mon.Month),
                datasets: [
                  {
                    label: "Cumulative Students",
                    data: monthlySignups.map((mon, i) => {
                      let cumultive = 0;
                      for (let j = 0; j < i + 1; j++) {
                        cumultive = cumultive + monthlySignups[j].Num;
                      }
                      console.log(cumultive);
                      return cumultive;
                    }),
                    borderColor: "rgba(255, 206, 86, 1)",
                    backgroundColor: "rgba(255, 206, 86, 0.2)",
                    tension: 0.1,
                    fill: "start",
                  },
                ],
              }}
            />
          </div>
          {/* <div className={styles.quizzes}>
            <h3>Number of Quizzes</h3>
          </div> */}
        </div>
        {/* <h2>Schools Actions</h2> */}
      </div>
    </div>
  );
};

export default AdminProfile;
