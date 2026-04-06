import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./css/NavSecondary.module.css";
type props = {
  actualPage: string;
  classNameExtra?: string;
};
export default function NavSecondary({ actualPage, classNameExtra }: props) {
  const { t } = useTranslation("common");
  return (
    <div className={classNameExtra}>
      {actualPage !== "oficial" && (
        <button className={styles.optionNav}>
          <Link
            to={"/oficial"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.optionText}>{t("nav_oficial")}</p>
          </Link>
        </button>
      )}

      {actualPage !== "fanon" && (
        <button className={styles.optionNav}>
          <Link
            to={"/fanon"}
            style={{ color: "white", textDecoration: "none" }}
          >
            {t("nav_fanon")}
          </Link>
        </button>
      )}

      {actualPage !== "images" && (
        <button className={styles.optionNav}>
          <Link
            to={"/images"}
            style={{ color: "white", textDecoration: "none" }}
          >
            {t("nav_images")}
          </Link>
        </button>
      )}

      {actualPage !== "highlight" && (
        <button className={`${styles.optionNav} ${styles.optionNavLast}`}>
          <Link
            to={"/featured"}
            style={{ color: "white", textDecoration: "none" }}
          >
            {t("nav_highlight")}
          </Link>
        </button>
      )}
    </div>
  );
}
