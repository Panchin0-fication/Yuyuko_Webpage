import {
  useState,
  type ChangeEvent,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { LogInput, LogHeader, LogContainer } from "@features";
import { SmallMessage, Message } from "@shared";
import styles from "./css/Login&Create.module.css";
export default function CreateAccount() {
  interface fileds {
    name: string;
    email?: string;
    password: string;
    confirmPass?: string;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [creationLoading, setCreationLoading] = useState<boolean>(false);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/isDataRegistered?name=${inputFields.name}&email=${inputFields.email}`,
      );
      const res = await response.json();
      console.log("resultado", res);

      switch (res.Context) {
        case "email":
          setEmailMessage(res.message);
          break;

        case "userName":
          setNameMessage(res.message);
          break;
        default:
          setNameMessage(null);
          setEmailMessage(null);
          break;
      }
      setLoading(false);
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
      setLoading(true);

      timerRef.current = window.setTimeout(isDataRegistered, 3000);
    }
  }, [inputFields.name, inputFields.email]);

  function handleClick(): void {
    if (
      inputFields.name === "" ||
      inputFields.email === "" ||
      inputFields.password === "" ||
      inputFields.confirmPass === ""
    ) {
      createMessage("error", "Ingresa todos los campos");
      return;
    }
    //UserName verification
    if (nameMessage) {
      createMessage("error", nameMessage);
      return;
    }
    if (emailMessage) {
      createMessage("error", emailMessage);
      return;
    }
    if (inputFields.password !== inputFields.confirmPass) {
      createMessage("error", "La conseña no coinside");
      return;
    }
    setSmallMessage(null);
    const createUser = async (): Promise<void> => {
      setCreationLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user?userName=${inputFields.name}&email=${inputFields.email}&role=User&password=${inputFields.password}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const res = await response.json();
      console.log("La respuesta", res);
      if (res.type === "Error") {
        createMessage("error", "Ingresa una direacción de correo");
        return;
      }
      localStorage.setItem("token", res.extra);
      createMessage("success", "Cuenta creada, ingresa sesión para validar");
      setPopupMessage(
        <Message
          header="Usuario creado"
          text="Cuenta ha sido creada con exito"
          setMessage={setPopupMessage}
          type="success"
          toRedirect="/auth/validate"
        />,
      );
      setCreationLoading(false);
    };
    createUser();
  }
  return (
    <>
      <LogContainer>
        <LogHeader title="Crear cuenta" />

        <LogInput
          label="Nombre de usuario"
          setInputs={setInputFields}
          inputValue={inputFields.name}
          inputs={inputFields}
          field="name"
          icon="/icons/person.svg"
          alert={nameMessage}
          type="text"
        />

        <LogInput
          label="Correo"
          setInputs={setInputFields}
          inputValue={inputFields.email}
          inputs={inputFields}
          field="email"
          icon="/icons/mail.svg"
          alert={emailMessage}
          type="text"
        />
        <LogInput
          label="Contraseña"
          setInputs={setInputFields}
          inputValue={inputFields.password}
          inputs={inputFields}
          field="password"
          icon="/icons/lock.svg"
          type="password"
        />
        <LogInput
          label="Confirmar contraseña"
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
            className={
              loading ? styles.createButtonInactive : styles.createButton
            }
            onClick={() => {
              if (!loading) {
                handleClick();
              }
            }}
          >
            Crear usuario
          </button>
          {creationLoading && (
            <img
              className={styles.loadingImage}
              src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
            />
          )}
        </div>

        {popupMessage}
      </LogContainer>
    </>
  );
}
