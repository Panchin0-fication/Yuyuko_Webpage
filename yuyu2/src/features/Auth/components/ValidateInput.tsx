import { type ReactNode } from "react";
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
const {t} = useTranslation("auth");
export default function ValidateInput({
  verificationCode,
  setVerificationCode,
  loading,
  handleVerify,
  position = "validateCode",
  smallMessage,
  header = t("input_label_verification_code"),
  buttonLabel = t("button_validate_account"),
}: props) {
  
  return (
    <section className={styles.validation}>
      <p className={styles.verificationCodeHeader}>{header}</p>
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
          {buttonLabel}
        </button>
      </div>
      {loading && position === "validateCode" && (
        <img
          className={styles.loadingImg}
          src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
        />
      )}
      {position === "validateCode" && smallMessage}
    </section>
  );
}
