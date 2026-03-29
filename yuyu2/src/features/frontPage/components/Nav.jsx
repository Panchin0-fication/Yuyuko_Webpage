import { Link } from "react-router-dom";
import styles from "./css/Nav.module.css";
export default function Nav() {
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
            <p className={styles.textOption}>Info oficial</p>
          </Link>
        </button>
        <button className={styles.navOption}>
          <Link
            to={"/fanon"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>Info fanon</p>
          </Link>
        </button>
        <button className={styles.navOption}>
          <Link
            to={"/images"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>Imagenes</p>
          </Link>
        </button>
        <button className={styles.navOption}>
          <Link
            to={"/merch"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>Mercancía</p>
          </Link>
        </button>
        <button className={styles.navOption}>
          <Link
            to={"/featured"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.textOption}>Destacado</p>
          </Link>
        </button>
      </nav>
      <div className={styles.borderLine}></div>
    </>
  );
}
