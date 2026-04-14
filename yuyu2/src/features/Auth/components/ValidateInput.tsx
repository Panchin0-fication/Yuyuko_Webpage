import { type ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/ValidateInput.module.css";
type props = {
  verificationCode: string;
  setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  handleVerify: (value: string) => void;
  position?: "validateCode" | "resend" | "chaneEmail" | null;
  smallMessage: null | ReactNode;
  header?: string;
  buttonLabel?: string;
};
export default function ValidateInput({
  verificationCode,
  setVerificationCode,
  loading,
  handleVerify,
  position = "validateCode",
  smallMessage,
  header = "input_label_verification_code",
  buttonLabel = "button_validate_account",
}: props) {
  const { t } = useTranslation("auth");
  return (
    <section className={styles.validation}>
      <p className={styles.verificationCodeHeader}>{t(header)}</p>
      <div className={styles.validationFields}>
        <input
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          type="text"
        />
        <button
          className={styles.validateButton}
          onClick={() => {
            if (!loading) {
              handleVerify(verificationCode);
            }
          }}
        >
          {t(buttonLabel)}
        </button>
      </div>

      <img
        className={styles.loadingImg}
        src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
        style={{
          display: loading && position === "validateCode" ? "block" : "none",
        }}
      />

      {position === "validateCode" && smallMessage}
    </section>
  );
}
