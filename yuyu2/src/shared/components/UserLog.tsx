import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ValidateSession, InfoMessage, type withUserData } from "@shared";
import { useEffect, useState } from "react";
import styles from "./css/UserLog.module.css";

export default function UserLog() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const [username, setUsername] = useState<null | string>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [optionHover, setOptionHover] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const getUsername = async () => {
      const res = (await ValidateSession(
        localStorage.getItem("token"),
      )) as withUserData;

      if (res.success) {
        setUsername(res.user_data.userName);
      }
    };
    getUsername();
  }, []);

  function goToLogin() {
    navigate("/auth/login");
  }
  return (
    <>
      <div style={{ display: showInfo ? "block" : "none" }}>
        <InfoMessage
          header="Cuenta"
          onCancel={() => setShowInfo(false)}
          onContinue={() => navigate("/auth/create")}
        >
          <h2>¿Para que sirve?</h2>
          <p>Principalmente para funcionalidades en el apartado de FanArts.</p>
          <ul>
            <li>Guardar tags a ocultar</li>
            <li>Visualizar FanArts explicitos</li>
            <li>Subir FanArts</li>
          </ul>
          <h2>¿Es necesario?</h2>
          <p>
            Podras acceder a la mayoría de apartados en la pagina y
            funcionalidades por lo que no es necesario; La mayor restriccion al
            no tener session es que no podras subir FanArts.
          </p>
          <p>Presiona continuar para crear una cuenta.</p>
        </InfoMessage>
      </div>
      <div className={styles.userLogContainer}>
        <div
          className={styles.hoverInfo}
          style={{
            display: showOptions ? "flex" : "none",
          }}
          onMouseOut={() => setOptionHover("")}
        >
          <span
            style={{
              backgroundColor: optionHover === "login" ? "blue" : "black",
            }}
            onMouseOver={() => setOptionHover("login")}
            onClick={goToLogin}
          >
            Ingresar
          </span>
          <span
            style={{
              backgroundColor: optionHover === "config" ? "blue" : "black",
            }}
            onMouseOver={() => setOptionHover("config")}
          >
            Configuracion
          </span>
          <span
            style={{
              backgroundColor: optionHover === "info" ? "blue" : "black",
            }}
            onMouseOver={() => setOptionHover("info")}
            onClick={() => setShowInfo(true)}
          >
            Información
          </span>
        </div>

        <div
          className={styles.userLog}
          onClick={() => setShowOptions(!showOptions)}
        >
          <img src="/icons/person.svg"></img>
          {username ? (
            <p className={styles.username}>{username}</p>
          ) : (
            <p
              className={styles.username}
              style={{ color: "rgb(45, 45, 45) " }}
            >
              Fantasma
            </p>
          )}
        </div>
      </div>
    </>
  );
}
