import { useState, type ReactNode, useEffect } from "react";
import { ValidateInput, ValidateContainerAndHeader } from "@features";
import { ValidateSession, SmallMessage, Message } from "@shared";
import styles from "./css/ValidateUser.module.css";
export default function ValidateUser() {
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

  useEffect(() => {
    const toAsync = async (): Promise<void> => {
      const res = await ValidateSession(localStorage.getItem("token"));
      if (res?.reason === "Expired") {
        setPopupMessage(
          <Message
            header={"Sesión expirada"}
            text={res.message}
            type="error"
            setMessage={setPopupMessage}
            toRedirect={"/user/login"}
          ></Message>,
        );
        return;
      }
      if (res?.data?.verified === true) {
        setPopupMessage(
          <Message
            header={"Cuenta ya validada"}
            text={"Tu cuenta ya ha sido validada"}
            type="error"
            setMessage={setPopupMessage}
            toRedirect={"/auth/login"}
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
      `${import.meta.env.VITE_API_URL}/user/resendCode`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );
    const res = await response.json();
    if (res.type === "Success") {
      setSmallMessage(
        <SmallMessage type={"success"} message={res.message}></SmallMessage>,
      );
    } else {
      setSmallMessage(
        <SmallMessage type={"error"} message={res.message}></SmallMessage>,
      );
    }

    setLoading(false);
  };

  async function changeEmail(): Promise<void> {
    setSmallMessage(null);
    setPosition("chaneEmail");
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/changeEmail/${newEmail}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      setSmallMessage(
        <SmallMessage
          type={"error"}
          message={"Debes ingresar una dirrecion de correo"}
        ></SmallMessage>,
      );
    } else {
      const res = await response.json();
      if (res.type === "Success") {
        setSmallMessage(
          <SmallMessage type={"success"} message={res.message}></SmallMessage>,
        );
      }
    }
    setLoading(false);
  }

  async function verifyAccount(code: string): Promise<void> {
    setSmallMessage(null);
    setPosition("validateCode");
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/verify-email?token=${code}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );
    const res = await response.json();
    if (res.type === "Success") {
      setSmallMessage(
        <SmallMessage type={"success"} message={res.message}></SmallMessage>,
      );
    } else {
      setSmallMessage(
        <SmallMessage type={"error"} message={res.message}></SmallMessage>,
      );
    }

    setLoading(false);
  }

  return (
    <>
      <ValidateContainerAndHeader title="Validación de usuario">
        <div className={styles.info}>
          <img src="/icons/info_circle.svg" alt="" />
          <p className={styles.generalInfo}>
            Se a enviado un codigo de verificación a tu correo
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
              <p className={styles.generalInfo}>Reenviar codigo</p>
              <img
                className={`${styles.iconOption} ${displayOption === "resend" && styles.iconInverted}`}
                src="/icons/arrow_down.svg"
                alt=""
              />
            </header>

            {displayOption === "resend" && (
              <div className={styles.extra}>
                <p>
                  Si hay un correo con la dirreccion registrada se eviará un
                  nuevo codigo de verificación
                </p>
                <button
                  className={styles.buttonInExtra}
                  onClick={() => {
                    if (!loading) {
                      resend();
                    }
                  }}
                >
                  Enviar
                  <img src="/icons/mail.svg" alt="" />
                </button>
                {loading && positon === "resend" && (
                  <img
                    className={styles.loadingImg}
                    src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
                  ></img>
                )}
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
              <p className={styles.generalInfo}>Cambiar correo de la cuenta</p>
              <img
                className={`${styles.iconOption} ${displayOption === "changeEmail" && styles.iconInverted}`}
                src="/icons/arrow_down.svg"
              />
            </header>

            {displayOption === "changeEmail" && (
              <div className={styles.extra}>
                <p>Email nuevo</p>
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
                  Cambiar correo
                  <img src="/icons/mail.svg" alt="" />
                </button>
                {loading && positon === "chaneEmail" && (
                  <img
                    className={styles.loadingImg}
                    src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
                  />
                )}
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
