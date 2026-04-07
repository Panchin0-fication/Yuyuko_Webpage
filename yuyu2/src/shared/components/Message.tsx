import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/Message.module.css";
type props = {
  header: String;
  text: String;
  type: "error" | "success";
  setMessage: (value: null | ReactNode) => void;
  toRedirect: string;
  previus?: any;
};

export default function Message({
  header,
  text,
  type,
  setMessage,
  toRedirect = "",
  previus = "/",
}: props) {
  const navigate = useNavigate();
  function onClick(): void {
    navigate(toRedirect, previus);
  }
  return (
    <>
      <div className={styles.filterMsg}></div>
      <div
        className={`${styles.message} ${type === "error" ? styles.error : styles.succes}`}
      >
        <header className={styles.headerMsg}>
          <h2>{header}</h2>

          {toRedirect === "" && <p onClick={() => setMessage(null)}>X</p>}
        </header>
        <hr></hr>
        <br />
        <div className={styles.content}>
          <img
            src={
              type === "error" ? "/icons/error_circle.svg" : "/icons/check.svg"
            }
          />
          <p>{text}</p>
        </div>
        {toRedirect !== "" && (
          <div className={styles.button}>
            <button className={styles.continue} onClick={onClick}>
              <p className={styles.continueText}>Continuar</p>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
