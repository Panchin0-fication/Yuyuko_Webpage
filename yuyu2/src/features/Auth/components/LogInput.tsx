import { type ChangeEvent } from "react";
import styles from "./css/LogInput.module.css";
type Inputs = {
  name: string;
  email?: string;
  password: string;
  confirmPass?: string;
};
type props = {
  label: string;
  inputValue: string | undefined;
  setInputs: (value: {
    name: string;
    email?: string;
    password: string;
    confirmPass?: string;
  }) => void;
  inputs: Inputs;
  icon: string;
  field: keyof Inputs;
  alert?: string | null;
  type?: string;
};
export default function LogInput({
  label,
  inputValue,
  setInputs,
  inputs,
  field,
  icon,
  alert,
  type = "text",
}: props) {
  return (
    <>
      <div className={styles.label}>
        <img src={icon} alt="" />
        <p>{label}</p>
      </div>

      {alert && <p className={styles.nameWarning}>{alert}</p>}
      <input
        className={styles.fieldInput}
        value={inputValue}
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          setInputs({ ...inputs, [field]: e.target.value });
        }}
        type={type}
      />
    </>
  );
}
