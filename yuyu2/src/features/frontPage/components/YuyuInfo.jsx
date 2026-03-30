import { useTranslation } from "react-i18next";
import styles from "./css/YuyuInfo.module.css";
export default function YuyuInfo() {
  const { t } = useTranslation("home");
  return (
    <div className={styles.yuyuInfo}>
      <div className={styles.imageInfo}></div>
      <div className={styles.bodyText}>
        <h2>{t("yuyu_info_header")}</h2>
        <p>{t("yuyu_info_paragraph1")}</p>
        <p>{t("yuyu_info_paragraph1")}</p>
      </div>
      <div className={styles.imageInfo}></div>
    </div>
  );
}
