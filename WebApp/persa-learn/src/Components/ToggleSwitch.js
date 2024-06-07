import React from "react";
import styles from "./ToggleSwitch.module.css";

const ToggleSwitch = ({
  checked,
  onChange,
  name = "add a name",
  yes = "yes",
  no = "no",
}) => {
  return (
    // <div className="toggle-switch">
    <div className={styles.toggle_switch} data-cy="toggleTeacher">
      <input
        type="checkbox"
        // className="toggle-switch-checkbox"
        className={styles.toggle_switch_checkbox}
        checked={checked}
        name={name}
        id={name}
        onChange={(e) => onChange(e.target.checked)}
      />
      {/* <label className="toggle-switch-label" htmlFor={name}> */}
      <label
        className={styles.toggle_switch_label}
        htmlFor={name}
        tabIndex={0}
        role="button"
        aria-selected={false}
        onKeyDown={(e) => {
          if (e.keyCode === 13) onChange(!checked);
        }}
      >
        {/* <span className="toggle-switch-inner" data-yes={yes} data-no={no} /> */}
        <span
          className={styles.toggle_switch_inner}
          data-yes={yes}
          data-no={no}
        />
        {/* <span className="toggle-switch-switch" /> */}
        <span className={styles.toggle_switch_switch} />
      </label>
    </div>
  );
};

export default ToggleSwitch;
