import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ValidateContainerAndHeader, ValidateInput } from "@features";
import { SmallMessage, Message, type response } from "@shared";
import styles from "./css/ChangePassword.module.css";
export default function ChangePassword() {
  const {t, i18n} = useTranslation("auth")
  const [email, setEmail] = useState<string>("");
  const [smallMessage, setSmallMessage] = useState<null | ReactNode>(null);
  const [message, setMessage] = useState<null | ReactNode>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [inputs, setInputs] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSendEmail(): Promise<void> {
    if (email === "") {
      setSmallMessage(
        <SmallMessage message={t("no_email_provided")} type="error" />,
      );
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("email",email);
    formData.append("lang",i18n.language)
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/reset_password/begin`,{
        method: "POST",
        body:formData
      },
    );
    const res = (await response.json()) as response;
    console.log("QUWEE",res)

    setSmallMessage(<SmallMessage message={t(res.code)} type={res.success ? "success":"error"} />)
    if(res.success){setShowInputs(true);}
    
    setLoading(false);
  }

  async function changePassword(): Promise<void> {
    if (
      inputs.code === "" ||
      inputs.confirmPassword === "" ||
      inputs.password === ""
    ) {
      setSmallMessage(
        <SmallMessage
          message={t("insufficient_input_data")}
          type="error"
        />,
      );
      return;
    }
    if (inputs.password !== inputs.confirmPassword) {
      setSmallMessage(
        <SmallMessage message={t("unmatching_passwords")} type="error" />,
      );
      return;
    }
    const formData = new FormData();
    formData.append("token",inputs.code);
    formData.append("password",inputs.password);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/reset_password/change`,{
        method: "POST",
        body:formData
      },
    );
    const res = (await response.json()) as response;
    if (res.success) {
      setMessage(
        <Message
          header={t("message_header_password_changed")}
          text={t(res.code)}
          type="success"
          setMessage={setMessage}
          toRedirect={"/auth/login"}
        />,
      );
      setSmallMessage(null);
    } else {
      setSmallMessage(<SmallMessage type="error" message={t(res.code)} />);
    }
  }
  return (
    <>
      <ValidateContainerAndHeader title={t("page_header_change_password")}>
        <ValidateInput
          verificationCode={email}
          setVerificationCode={setEmail}
          loading={loading}
          handleVerify={handleSendEmail}
          smallMessage={smallMessage}
          header={"input_email_send_code"}
          buttonLabel={"page_button_resend_code"}
        />
        {showInputs && (
          <div className={styles.resetInputs}>
            <div>
              <h2>{t("input_label_reset_code")}</h2>
              <input
                className={styles.inputCode}
                value={inputs.code}
                onChange={(e) => setInputs({ ...inputs, code: e.target.value })}
                type="text"
              />
            </div>
            <div>
              <p>{t("input_label_new_password")}</p>
              <input
                className={styles.inputPassword}
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                type="password"
              />
            </div>
            <div>
              <p>{t("input_confirm_password_label")}</p>
              <input
                className={styles.inputPassword}
                value={inputs.confirmPassword}
                type="password"
                onChange={(e) =>
                  setInputs({ ...inputs, confirmPassword: e.target.value })
                }
              />
            </div>
            <button className={styles.changePasswordButton} onClick={changePassword}>Cambiar contraseña</button>
          </div>
        )}
      </ValidateContainerAndHeader>
      {message}
    </>
  );
}
