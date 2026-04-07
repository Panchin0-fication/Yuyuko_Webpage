//Message to display when is secesary to show extra information
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/InfoMessage.module.css";
type props = {
  header: string;
  onCancel: () => void;
  onContinue: () => void;
  children: ReactNode;
};
export default function InfoMessage({
  header,
  onCancel,
  onContinue,
  children,
}: props) {
  const { t } = useTranslation("common");
  return (
    <>
      <div className={styles.background}></div>
      <div className={`${styles.infoMessage}`}>
        <header>
          <h1>{header}</h1>
          <img src="/staticImgs/generalUse/Myon.png" alt="" />
        </header>
        <hr />
        <div className={styles.childrenInfo}>{children}</div>

        <div className={styles.buttons}>
          <button onClick={onCancel}>{t("button_cancel")}</button>
          <button onClick={onContinue}>{t("button_continue")}</button>
        </div>
      </div>
    </>
  );
}
