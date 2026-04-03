import { useTranslation } from "react-i18next";
import styles from "./css/InfoWebpage.module.css";
export default function InfoWebPage() {
  const { t } = useTranslation("home");
  return (
    <>
      <div className={styles.textBox}>
        <img src="/staticImgs/generalUse/yuyuko-yuyuko-saigyouji.gif" alt="" />
        <p>{t("page_info")}</p>
      </div>
      <div className={styles.sections}>
        <div className={`${styles.section} ${styles.info}`}>
          <h1>{t("section_information_header")}</h1>
          <p>{t("section_information_text")}</p>
        </div>
        <div className={`${styles.section} ${styles.images}`}>
          <h1>{t("section_images_header")}</h1>
          <p>{t("section_images_text")}</p>
        </div>
        <div className={`${styles.section} ${styles.extras}`}>
          <h1>{t("section_extra_header")}</h1>
          <p>{t("section_extra_text")}</p>
        </div>
      </div>
    </>
  );
}
