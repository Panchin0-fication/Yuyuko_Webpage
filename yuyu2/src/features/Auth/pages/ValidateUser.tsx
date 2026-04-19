import { useState, type ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ValidateInput, ValidateContainerAndHeader } from "@features";
import { Profile, SmallMessage, Message, type response } from "@shared";
import styles from "./css/ValidateUser.module.css";
export default function ValidateUser() {
  const { t, i18n } = useTranslation("auth");
  const location = useLocation();
  const [popupMessage, setPopupMessage] = useState<null | ReactNode>(null);
  const [smallMessage, setSmallMessage] = useState<null | ReactNode>(null);
  const [positon, setPosition] = useState<
    "validateCode" | "resend" | "chaneEmail"
  >("validateCode");
  const [displayOption, setDisplayOption] = useState<
    "resend" | "changeEmail" | ""
  >("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const from = location.state?.from || "/";

  useEffect(() => {
    const toAsync = async (): Promise<void> => {
      const res = await Profile(localStorage.getItem("token"));
      if (res.code === "TOKEN_EXPIRED") {
        setPopupMessage(
          <Message
            header={t("message_header_expired")}
            text={t(res.code)}
            type="error"
            setMessage={setPopupMessage}
            toRedirect={"/auth/login"}
            previus={from}
          ></Message>,
        );
        return;
      }
      if (res.user_data.verified === true) {
        setPopupMessage(
          <Message
            header={t("message_header_already_validated")}
            text={t("message_body_already_validated")}
            type="error"
            setMessage={setPopupMessage}
            toRedirect={"/auth/login"}
            previus={from}
          ></Message>,
        );
        return;
      }
    };
    toAsync();
  }, []);

  const resend = async (): Promise<void> => {
    setSmallMessage(null);
    setPosition("resend");
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/resendCode?lang=${i18n.language}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );
    const res = (await response.json()) as response;
    setSmallMessage(
      <SmallMessage
        type={res.success ? "success" : "error"}
        message={t(res.code)}
      ></SmallMessage>,
    );
    setLoading(false);
  };

  async function changeEmail(): Promise<void> {
    setSmallMessage(null);
    setPosition("chaneEmail");
    setLoading(true);
    const formData = new FormData();
    formData.append("email", newEmail);
    formData.append("lang", String(i18n.language));
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/changeEmail`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    if (!response.ok) {
      setSmallMessage(
        <SmallMessage
          type={"error"}
          message={t("small_message_not_email_format")}
        ></SmallMessage>,
      );
    } else {
      const res = (await response.json()) as response;
      if (res.success) {
        setPopupMessage(
          <Message
            header={"Cuenta validada"}
            text={t(res.code)}
            type="success"
            setMessage={setPopupMessage}
            toRedirect={from}
          />,
        );
      } else
        setSmallMessage(
          <SmallMessage type="error" message={t(res.code)}></SmallMessage>,
        );
    }
    setLoading(false);
  }

  async function verifyAccount(code: string): Promise<void> {
    setSmallMessage(null);
    setPosition("validateCode");
    setLoading(true);

    const formData = new FormData();
    formData.append("token", code);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/verify-email?token=${code}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const res = (await response.json()) as response;
    setPopupMessage(
      <Message
        type={res.success ? "success" : "error"}
        text={t(res.code)}
        header={t("message_header_verified_account")}
        setMessage={setPopupMessage}
        toRedirect={from}
      />,
    );
    setLoading(false);
  }

  return (
    <>
      <ValidateContainerAndHeader title={t("page_header_validate")}>
        <div className={styles.info}>
          <img src="/icons/info_circle.svg" alt="" />
          <p className={styles.generalInfo}>
            {t("page_paragraph_one_validate")}
          </p>
        </div>

        <ValidateInput
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          loading={loading}
          handleVerify={verifyAccount}
          position={positon}
          smallMessage={smallMessage}
        />
        <section className={styles.options}>
          <div className={styles.option}>
            <header
              onClick={() => {
                displayOption === "resend"
                  ? setDisplayOption("")
                  : setDisplayOption("resend");
              }}
            >
              <p className={styles.generalInfo}>
                {t("page_subtitle_resend_code")}
              </p>
              <img
                className={`${styles.iconOption} ${displayOption === "resend" && styles.iconInverted}`}
                src="/icons/arrow_down.svg"
                alt=""
              />
            </header>

            {displayOption === "resend" && (
              <div className={styles.extra}>
                <p>{t("page_paragraph_resend_code_info")}</p>
                <button
                  className={styles.buttonInExtra}
                  onClick={() => {
                    if (!loading) {
                      resend();
                    }
                  }}
                >
                  {t("page_button_resend_code")}
                  <img src="/icons/mail.svg" alt="" />
                </button>
                <img
                  className={styles.loadingImg}
                  src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
                  style={{
                    display: loading && positon === "resend" ? "block" : "none",
                  }}
                ></img>

                {positon === "resend" && smallMessage}
              </div>
            )}
          </div>
          <div className={styles.option}>
            <header
              onClick={() => {
                displayOption === "changeEmail"
                  ? setDisplayOption("")
                  : setDisplayOption("changeEmail");
              }}
            >
              <p className={styles.generalInfo}>
                {t("page_subtitle_change_email")}
              </p>
              <img
                className={`${styles.iconOption} ${displayOption === "changeEmail" && styles.iconInverted}`}
                src="/icons/arrow_down.svg"
              />
            </header>

            {displayOption === "changeEmail" && (
              <div className={styles.extra}>
                <p>{t("page_input_label_change_email")}</p>
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  type="text"
                />
                <button
                  className={styles.buttonInExtra}
                  onClick={() => {
                    if (!loading) {
                      changeEmail();
                    }
                  }}
                >
                  {t("page_button_change_email")}
                  <img src="/icons/mail.svg" alt="" />
                </button>

                <img
                  className={styles.loadingImg}
                  src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
                  style={{
                    display:
                      loading && positon === "chaneEmail" ? "block" : "none",
                  }}
                />

                {positon === "chaneEmail" && smallMessage}
              </div>
            )}
          </div>
        </section>
      </ValidateContainerAndHeader>
      {popupMessage}
    </>
  );
}
