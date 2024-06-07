import React, { useState } from "react";
import { createModule } from "../../http_Requests/teacherRequests";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import styles from "./OverlayAddModule.module.css";

const OverlayAddModule = ({
  isAddModule,
  moduleCreated,
  setIsAddModule,
  setModuleCreated,
  getModules,
}) => {
  const [newModule, setNewModule] = useState();

  const addModule = async () => {
    //add module to database
    if (newModule != null) {
      let data = await createModule({ moduleName: newModule });
      //get all modules
      await getModules();
      setModuleCreated(true);
    } else {
      alert("please enter a module");
    }
  };
  return (
    <div className={styles.overlay} aria-disabled={!isAddModule}>
      <div className={styles.message_box}>
        {moduleCreated ? (
          <h1>Module created successfully</h1>
        ) : (
          <>
            <h1>Add a new module</h1>

            <CustomInput placeholder={"Module Name"} setValue={setNewModule} />
            <CustomButton text={"Ok"} onClick={() => addModule()} />
          </>
        )}
        <CustomButton
          text={"Back"}
          type={2}
          onClick={() => {
            setIsAddModule(false);
            setModuleCreated(false);
          }}
        />
      </div>
    </div>
  );
};

export default OverlayAddModule;
