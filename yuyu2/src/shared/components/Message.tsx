import { useState, type ReactNode } from "react";
import { Link, type To } from "react-router-dom";
import styles from "./css/Message.module.css";
type props = {
  header: String;
  text: String;
  type: "error" | "success";
  setMessage: (value: null | ReactNode) => void;
  toRedirect: To;
};
export default function Message({
  header,
  text,
  type,
  setMessage,
  toRedirect = "",
}: props) {
  return (
    <>
      <div className="filterMsg"></div>
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
            <button className={styles.continue}>
              <Link className={styles.continueText} to={toRedirect}>
                Continuar
              </Link>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
