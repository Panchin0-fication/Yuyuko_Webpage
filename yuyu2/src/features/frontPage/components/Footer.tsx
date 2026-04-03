import { useTranslation, Trans } from "react-i18next";
import styles from "./css/Footer.module.css";
export default function Footer() {
  const { t } = useTranslation("home");
  return (
    <>
      <div className={styles.footer}>
        <h2>{t("footer_header")}</h2>
        <p>
          <Trans
            t={t}
            i18nKey="footer_body"
            components={{
              mail: <strong className={styles.mailText} />,
              github: 
                <a
                  href="https://github.com/Panchin0-fication"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.githubLink}
                />
              
            }}
          />
        </p>
      </div>
      <br />
    </>
  );
}
