import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Profile, InfoMessage, type withUserData } from "@shared";
import { useEffect, useState } from "react";
import styles from "./css/UserLog.module.css";

export default function UserLog() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [username, setUsername] = useState<null | string>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [optionHover, setOptionHover] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const getUsername = async () => {
      const res = (await Profile(
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
          header={t("log_info_header")}
          onCancel={() => setShowInfo(false)}
          onContinue={() => navigate("/auth/create")}
        >
          <h2>{t("log_info_h2_one")}</h2>
          <p>{t("log_info_p_one")}</p>
          <ul>
            <li>{t("log_info_li_one")}</li>
            <li>{t("log_info_li_two")}</li>
            <li>{t("log_info_li_three")}</li>
          </ul>
          <h2>{t("log_info_h2_two")}</h2>
          <p>{t("log_info_p_two")}</p>
          <p>{t("log_info_p_three")}</p>
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
            {t("log_login_button")}
          </span>
          <span
            style={{
              backgroundColor: optionHover === "config" ? "blue" : "black",
            }}
            onMouseOver={() => setOptionHover("config")}
            onClick={() => navigate("/auth/accountConfig")}
          >
            {t("log_config_button")}
          </span>
          <span
            style={{
              backgroundColor: optionHover === "info" ? "blue" : "black",
            }}
            onMouseOver={() => setOptionHover("info")}
            onClick={() => setShowInfo(true)}
          >
            {t("log_info_button")}
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
              {t("log_not_loged_name")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
