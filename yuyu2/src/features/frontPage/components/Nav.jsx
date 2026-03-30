import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./css/Nav.module.css";
export default function Nav() {
  const { t } = useTranslation("home");
  return (
    <>
      <nav className={styles.navMain}>
        <img
          src="/staticImgs/generalUse/yuyuko-yuyukofumo.gif"
          alt="brand"
          className={styles.brandYuyu}
        />

        <button className={styles.navOption}>
          <Link
            to={"/oficial"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>{t("nav_oficial")}</p>
          </Link>
        </button>
        <button className={styles.navOption}>
          <Link
            to={"/fanon"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>{t("nav_fanon")}</p>
          </Link>
        </button>
        <button className={styles.navOption}>
          <Link
            to={"/images"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>{t("nav_images")}</p>
          </Link>
        </button>
        <button className={styles.navOption}>
          <Link
            to={"/merch"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>{t("nav_merch")}</p>
          </Link>
        </button>
        <button className={styles.navOption}>
          <Link
            to={"/featured"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>{t("nav_highlight")}</p>
          </Link>
        </button>
      </nav>
      <div className={styles.borderLine}></div>
    </>
  );
}
