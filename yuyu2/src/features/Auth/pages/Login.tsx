import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogInput, LogHeader, LogContainer } from "@features";
import {
  SmallMessage,
  Message,
  ValidateSession,
  BlockMessage,
  type withToken,
} from "@shared";
import styles from "./css/Login&Create.module.css";

export default function Login() {
  const { t } = useTranslation("auth");
  const location = useLocation();
  const [inputs, setInputs] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [smallMessage, setSmallMessage] = useState<null | ReactNode>(null);
  const [message, setMessage] = useState<null | ReactNode>(null);
  const [blockMessage, setBlockMessage] = useState<null | ReactNode>(null);

  const from = location.state?.from || "/";
  useEffect(() => {
    const callBackend = async (): Promise<void> => {
      const res = await ValidateSession(localStorage.getItem("token"));
      if (res?.success) {
        setBlockMessage(
          <BlockMessage type="success" message={t("block_message_login")} />,
        );
      }
    };
    callBackend();
  }, []);
  async function handleClick(): Promise<void> {
    if (inputs.name === "" || inputs.password === "") {
      setSmallMessage(
        <SmallMessage
          type="error"
          message={t("small_message_insufficient_data_login")}
        />,
      );
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("userName", inputs.name);
    formData.append("password", inputs.password);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
      method: "POST",
      body: formData,
    });
    const res = (await response.json()) as withToken;
    setLoading(false);
    if (
      res.code === "LOGIN_SUCCESSFUL" ||
      res.code === "LOGIN_SUCCESSFUL_UNVERIFIED"
    ) {
      setSmallMessage(
        <SmallMessage type="success" message={t("message_body_login")} />,
      );
      setMessage(
        <Message
          header={t("message_header_success")}
          text={
            !blockMessage
              ? t("message_body_login")
              : t("message_body_changed_login")
          }
          type="success"
          setMessage={setMessage}
          toRedirect={res.code === "LOGIN_SUCCESSFUL" ? from : "/auth/validate"}
          previus={{ state: { from: location.pathname } }}
        />,
      );
      localStorage.setItem("token", String(res.token));
    } else {
      setSmallMessage(<SmallMessage type="error" message={t(res.code)} />);
    }
  }
  return (
    <>
      <div className={styles.elements}>
        {blockMessage}
        <LogContainer>
          <LogHeader title={t("page_header_login")} />
          <LogInput
            label={t("input_username_label")}
            setInputs={setInputs}
            inputValue={inputs.name}
            inputs={inputs}
            field="name"
            icon="/icons/person.svg"
            type="text"
          />
          <LogInput
            label={t("input_password_label")}
            setInputs={setInputs}
            inputValue={inputs.password}
            inputs={inputs}
            field="password"
            icon="/icons/lock.svg"
            type="password"
          />
          <Link to={"/auth/changePassword"}>
            <p>{t("forgot_password")}</p>
          </Link>
          <button
            className={
              loading ? styles.createButtonInactive : styles.createButton
            }
            onClick={() => {
              if (!loading) {
                handleClick();
              }
            }}
          >
            {t("log_in_button_login")}
          </button>
          {smallMessage}
        </LogContainer>
      </div>

      {message}
    </>
  );
}
