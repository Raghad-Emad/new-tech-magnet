import React, { useEffect, useState } from "react";
import ClassItem from "../../Components/TeacherProfile/ClassList/ClassItem";
import {
  getTeachersClasses,
  getTeachersDetails,
} from "../../http_Requests/teacherRequests";
import { useNavigate } from "react-router-dom";
import ClassDetails from "../../Components/TeacherProfile/DetailsBox/ClassDetails";
import AddClass from "../../Components/TeacherProfile/DetailsBox/AddClass";
import ClassList from "../../Components/TeacherProfile/ClassList/ClassList";

import styles from "./TeacherProfile.module.css";
import CustomButton from "../../Components/CustomButton";
import BarStacked from "../../Components/Charts/BarStacked";
import BarChart from "../../Components/Charts/BarChart";
import {
  getAllAssignmentProgress,
  getAllAssignmentRatings,
} from "../../http_Requests/TeacherRequests/StatRequests";

const TeacherProfile = () => {
  const [firstName, setFirstName] = useState();
  const [assignProgress, setAssignProgress] = useState([]);
  const [averageRating, setAverageRating] = useState([]);

  const navigate = useNavigate();

  // const [usersName, setUsersName] = useState();
  const getDetails = async () => {
    const data = await getTeachersDetails();
    if (data.status === "success") {
      setFirstName(data.details.FirstName);
    }
  };

  const getAverageRatings = async () => {
    const data = await getAllAssignmentRatings();
    // console.log(data);
    if (data.status === "success") {
      console.log(data.data);
      setAverageRating(data.data);
    }
  };

  const getAssignmentProg = async () => {
    const data = await getAllAssignmentProgress();
    if (data.status === "success") {
      const completed = data.data.filter((data) => data.Caption === "Complete");
      const incompleted = data.data.filter(
        (data) => data.Caption === "Incomplete"
      );

      const ne = [];
      if (completed.length < incompleted.length) {
        incompleted.map((a) => {
          let isf = false;
          completed.map((b) => {
            if (a.ClassName == b.ClassName) {
              // ne = a;
              a.incompleted = a.Number;
              a.completed = b.Number;
              ne.push(a);
              isf = true;
            }
          });
          if (!isf) {
            a.completed = a.Number;
            a.incompleted = 0;
            ne.push(a);
          }
        });
      } else {
        completed.map((a) => {
          let isf = false;
          incompleted.map((b) => {
            if (a.ClassName == b.ClassName) {
              // ne = a;
              a.completed = a.Number;
              a.incompleted = b.Number;
              ne.push(a);
              isf = true;
            }
          });
          if (!isf) {
            a.completed = a.Number;
            a.incompleted = 0;
            ne.push(a);
          }
        });
      }
      setAssignProgress(ne);
    }
  };

  useEffect(async () => {
    await getDetails();
    await getAssignmentProg();
    await getAverageRatings();
  }, []);

  return (
    <div className="content-box">
      <h1>Teacher Profile</h1>
      {/* <div className="container"> */}
      <div className={styles.container}>
        <h2>Welcome back {firstName} </h2>
        <h3>Statistics</h3>
        <div className={styles.statistics}>
          <div className={styles.sign_ups}>
            <h3>Assignment Progress</h3>
            <BarStacked
              chartData={{
                datasets: [
                  {
                    label: "Complete",
                    data: assignProgress.map((x) => x.completed),
                    backgroundColor: ["RGB(27,128,0,0.2)"],
                    borderColor: ["RGB(27,128,0)"],
                    borderWidth: 1,
                  },
                  {
                    label: "Incomplete",
                    data: assignProgress.map((x) => x.incompleted),
                    backgroundColor: ["RGB(248,37,0,0.2)"],
                    borderColor: ["RGB(248,37,0)"],
                    borderWidth: 1,
                  },
                ],
                labels: assignProgress.map((x) => x.ClassName),
                stacked: true,
              }}
            />
          </div>
          <div className={styles.sign_ups}>
            <h3>Assignment Ratings</h3>
            <BarChart
              chartData={{
                datasets: [
                  {
                    label: "Rating",
                    data: averageRating.map((x) => x.AverageRating),
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgb(75, 192, 192,0.2)",

                    borderWidth: 1,
                  },
                ],
                labels: averageRating.map((x) => x.QuizName),
              }}
            />
          </div>
        </div>
        {/* <h3>Details</h3>
        <CustomButton
          text={"My details"}
          onClick={() => navigate("/details_teacher", {})}
        /> */}
      </div>
    </div>
  );
};

export default TeacherProfile;
