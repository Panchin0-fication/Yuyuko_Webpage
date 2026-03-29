import React, { useState, type ReactNode } from "react";
import { ValidateContainerAndHeader, ValidateInput } from "@features";
import { SmallMessage, Message } from "@shared";
import styles from "./css/ChangePassword.module.css";
export default function ChangePassword() {
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
        <SmallMessage message="Ingresa un correo" type="error" />,
      );
      return;
    }
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/reset_password/begin?email=${email}`,
    );
    const res = await response.json();
    if (res.type === "Error") {
      setSmallMessage(<SmallMessage message={res.message} type="error" />);
    } else {
      setSmallMessage(<SmallMessage message={res.message} type="success" />);
      setShowInputs(true);
    }
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
          message="Ingresa datos en todos los campos"
          type="error"
        />,
      );
      return;
    }
    if (inputs.password !== inputs.confirmPassword) {
      setSmallMessage(
        <SmallMessage message="Las contraseñas no coinciden" type="error" />,
      );
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/reset_password/change?token=${inputs.code}&password=${inputs.password}`,
    );
    const res = await response.json();
    if (res.type === "Success") {
      setMessage(
        <Message
          header="Contraseña cambiada"
          text={res.message}
          type="success"
          setMessage={setMessage}
          toRedirect={"/auth/login"}
        />,
      );
    } else {
      setSmallMessage(<SmallMessage type="error" message={res.message} />);
    }
  }
  return (
    <>
      <ValidateContainerAndHeader title="Cambiar contraseña">
        <ValidateInput
          verificationCode={email}
          setVerificationCode={setEmail}
          loading={loading}
          handleVerify={handleSendEmail}
          smallMessage={smallMessage}
          position={null}
          header="Correo de la cuenta"
          buttonLabel="Enviar"
        />
        {showInputs && (
          <div>
            <h2>Codigo de reinicio</h2>
            <input
              className={styles.inputCode}
              value={inputs.code}
              onChange={(e) => setInputs({ ...inputs, code: e.target.value })}
              type="password"
            />
            <p>Nueva contraseña</p>
            <input
              className={styles.inputPassword}
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              type="password"
            />
            <p>Confirmar contraseña</p>
            <input
              className={styles.inputPassword}
              value={inputs.confirmPassword}
              type="password"
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
            />
            <button onClick={changePassword}>Cambiar contraseña</button>
          </div>
        )}
      </ValidateContainerAndHeader>
      {message}
    </>
  );
}
