import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogInput, LogHeader, LogContainer } from "@features";
import { SmallMessage, Message, ValidateSession, BlockMessage } from "@shared";
import styles from "./css/Login&Create.module.css";

export default function Login() {
  const [inputs, setInputs] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [smallMessage, setSmallMessage] = useState<null | ReactNode>(null);
  const [message, setMessage] = useState<null | ReactNode>(null);
  const [blockMessage, setBlockMessage] = useState<null | ReactNode>(null);
  useEffect(() => {
    const callBackend = async (): Promise<void> => {
      const res = await ValidateSession(localStorage.getItem("token"));
      if (res?.type === "Success") {
        setBlockMessage(
          <BlockMessage
            type="success"
            message={`Ya tienes sesión iniciada con ${res?.data?.userName}`}
          />,
        );
      }
    };
    callBackend();
  }, []);
  async function handleClick(): Promise<void> {
    if (inputs.name === "" || inputs.password === "") {
      setSmallMessage(<SmallMessage type="error" message="Ingresa datos" />);
    }
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/login?userName=${inputs.name}&password=${inputs.password}`,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const res = await response.json();
    setLoading(false);
    console.log("La respuesta", res);
    if (res.type === "Success") {
      setSmallMessage(
        <SmallMessage type="success" message="Has iniciado sesión" />,
      );
      setMessage(
        <Message
          header="Login exitoso"
          text={!blockMessage ? "Has inicido sesión" : "Has cambiado de sesión"}
          type="success"
          setMessage={setMessage}
          toRedirect={res.isVerified ? "/" : "/auth/validate"}
        />,
      );
      localStorage.setItem("token", res.access_token);
    } else {
      setSmallMessage(<SmallMessage type="error" message={res.message} />);
    }
  }
  return (
    <>
      <div className={styles.elements}>
        {blockMessage}
        <LogContainer>
          <LogHeader title="Iniciar sesión" />
          <LogInput
            label="Nombre de usuario"
            setInputs={setInputs}
            inputValue={inputs.name}
            inputs={inputs}
            field="name"
            icon="/icons/person.svg"
            type="text"
          />
          <LogInput
            label="Contraseña"
            setInputs={setInputs}
            inputValue={inputs.password}
            inputs={inputs}
            field="password"
            icon="/icons/lock.svg"
            type="password"
          />
          <Link to={"/auth/changePassword"}>
            <p>¿Olvidaste tu contraseña?</p>
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
            Ingresar
          </button>
          {smallMessage}
        </LogContainer>
      </div>

      {message}
    </>
  );
}
