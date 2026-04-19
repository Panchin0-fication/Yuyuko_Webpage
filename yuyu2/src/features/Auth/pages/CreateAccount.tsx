import { useState, useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LogInput, LogHeader, LogContainer } from "@features";
import { SmallMessage, Message, type response, type withToken } from "@shared";
import styles from "./css/Login&Create.module.css";
export default function CreateAccount() {
  interface fileds {
    name: string;
    email?: string;
    password: string;
    confirmPass?: string;
  }
  const { t, i18n } = useTranslation("auth");
  const [loading, setLoading] = useState<boolean>(false);
  const [smallMessage, setSmallMessage] = useState<null | ReactNode>();
  const [popupMessage, setPopupMessage] = useState<null | ReactNode>();
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [nameMessage, setNameMessage] = useState<string | null>(null);
  const [inputFields, setInputFields] = useState<fileds>({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  const timerRef = useRef<number | null>(null);

  function createMessage(
    type: "error" | "info" | "success",
    message: string,
  ): void {
    setSmallMessage(<SmallMessage type={type} message={message} />);
  }

  const isDataRegistered = async (): Promise<void> => {
    if (inputFields.name !== "") {
      const formData = new FormData();
      formData.append(
        "email",
        inputFields.email !== "" ? String(inputFields.email) : "_",
      );
      formData.append(
        "name",
        inputFields.name !== "" ? String(inputFields.name) : "_",
      );
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/isDataRegistered`,
        {
          method: "POST",
          body: formData,
        },
      );
      const res = (await response.json()) as response;

      switch (res.code) {
        case "EMAIL_ALREADY_REGISTERED":
          setEmailMessage(t(res.code));
          break;
        case "USERNAME_ALREADY_REGISTERED":
          setNameMessage(t(res.code));
          break;
        default:
          setNameMessage(null);
          setEmailMessage(null);
          break;
      }
    }
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (inputFields.name !== "") {
      //Reset timer
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(isDataRegistered, 3000);
    }
  }, [inputFields.name, inputFields.email]);

  function createAccount(): void {
    if (
      inputFields.name === "" ||
      inputFields.email === "" ||
      inputFields.password === "" ||
      inputFields.confirmPass === ""
    ) {
      createMessage("error", t("insufficient_input_data"));
      return;
    }
    if (inputFields.password !== inputFields.confirmPass) {
      createMessage("error", t("unmatching_passwords"));
      return;
    }
    setSmallMessage(null);
    const createUser = async (): Promise<void> => {
      setLoading(true);
      const formData = new FormData();
      formData.append("userName", inputFields.name);
      formData.append("email", String(inputFields.email));
      formData.append("password", inputFields.password);
      formData.append("lang", i18n.language);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        createMessage("error", t("invalid_email_string_error"));
        return;
      }
      const res = (await response.json()) as withToken;

      if (res.token) localStorage.setItem("token", String(res.token));

      setPopupMessage(
        <Message
          header={
            res.success
              ? t("account_creation_success")
              : t("account_creation_error")
          }
          text={t(res.code)}
          setMessage={setPopupMessage}
          type={res.success ? "success" : "error"}
          toRedirect={res.success ? "/auth/validate" : ""}
        />,
      );
      setLoading(false);
    };
    createUser();
  }
  return (
    <div className={styles.elements}>
      <LogContainer>
        <LogHeader title={t("page_header_create_account")} />
        <LogInput
          label={t("input_username_label")}
          setInputs={setInputFields}
          inputValue={inputFields.name}
          inputs={inputFields}
          field="name"
          icon="/icons/person.svg"
          alert={nameMessage}
          type="text"
        />
        <LogInput
          label={t("input_email_label")}
          setInputs={setInputFields}
          inputValue={inputFields.email}
          inputs={inputFields}
          field="email"
          icon="/icons/mail.svg"
          alert={emailMessage}
          type="text"
        />
        <LogInput
          label={t("input_password_label")}
          setInputs={setInputFields}
          inputValue={inputFields.password}
          inputs={inputFields}
          field="password"
          icon="/icons/lock.svg"
          type="password"
        />
        <LogInput
          label={t("input_confirm_password_label")}
          setInputs={setInputFields}
          inputValue={inputFields.confirmPass}
          inputs={inputFields}
          field="confirmPass"
          icon="/icons/check.svg"
          type="password"
        />
        {smallMessage}
        <div className={styles.buttonAndLoad}>
          <button
            className={styles.createButton}
            onClick={() => {
              if (!loading) {
                createAccount();
              }
            }}
          >
            {t("button_create_account")}
          </button>

          <img
            className={styles.loadingImage}
            src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
            style={{ display: loading ? "block" : "none" }}
          />
        </div>

        {popupMessage}
      </LogContainer>
    </div>
  );
}
