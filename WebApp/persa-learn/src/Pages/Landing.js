import React from "react";
import { useNavigate } from "react-router-dom";

import CustomButton from "../Components/CustomButton";
import styles from "./Landing.module.css";

const Landing = () => {
  const navigate = useNavigate();

  const login = () => {
    navigate("/login");
  };
  return (
    <>
      <main>
        <section className={styles.hero}>
          <div className={styles.details}>
            <h1>Start Your Learning Journey</h1>
            <p>
              Whether your a student or a teacher PersaLearn can help you reach
              your goals.
            </p>
            <p>Avaiable on all devices.</p>
            <div className={styles.btns}>
              <CustomButton text={"Online"} onClick={login} />
              <CustomButton
                text={"App"}
                onClick={() => {
                  window.location.href =
                    "https://github.com/JMChurchill/COMP3000-Learning-Platform/releases/tag/v1.0.0";
                }}
              />
            </div>
          </div>
          <div className={styles.img} id="heroImage"></div>
        </section>
        <section className={styles.divider}>
          <h2>Teachers</h2>
          <div className={styles.img} id={styles.teacherImg}></div>
        </section>
        <section className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.img} id={styles.monitor}></div>
            <div>
              <h3>Monitor Progress</h3>
              <p>
                Keep up to date with your class and monitor the progress made on
                assignments from a simple interface
              </p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.img} id={styles.cClass}></div>
            <div>
              <h3>Create Classes</h3>
              <p>
                Create and monitor your classes Send class requests Check up on
                students
              </p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.img} id={styles.createAssign}></div>
            <div>
              <h3>Create Assignments</h3>
              <p>
                Create assignments for your classes from an intuative interface.
                Send out the assignments to your classes, and view their
                progress including what they thought of the activity so you can
                tailor your lessons to their feedback
              </p>
            </div>
          </div>
        </section>
        <section className={styles.divider}>
          <h2>Students</h2>
          <div className={styles.img} id={styles.studentImg}></div>
        </section>
        <section className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.img} id={styles.comActiv}></div>
            <div>
              <h3>Complete Activities To Level Up Your Account</h3>
              <p>
                Create assignments for your classes from an intuative interface.
                Send out the assignments to your classes, and view their
                progress including what they thought of the activity so you can
                tailor your lessons to their feedback{" "}
              </p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.img} id={styles.custom}></div>
            <div>
              <h3>Buy new items to customise your account</h3>
              <p></p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.img} id={styles.revise}></div>
            <div>
              <h3>Keep Track of notes and revise your subjects</h3>
              <p>
                Get the upperhand and stay ahead through the use of flashcards
                to practice your subjects
              </p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.img} id={styles.leaderboard}></div>
            <div>
              <h3>Compete with your classmates</h3>
              <p>Compete against your class with the class leaderboard</p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>
          Source code avaiable on{" "}
          <a href="https://github.com/JMChurchill/COMP3000-Learning-Platform">
            GitHub
          </a>
        </p>
      </footer>
    </>
  );
};

export default Landing;
