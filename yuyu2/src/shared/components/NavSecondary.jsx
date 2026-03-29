import { Link } from "react-router-dom";
import styles from "./css/NavSecondary.module.css";
export default function NavSecondary({ actualPage, classNameExtra }) {
  return (
    <div className={classNameExtra}>
      {actualPage !== "oficial" && (
        <button className={styles.optionNav}>
          <Link
            to={"/oficial"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <p className={styles.optionText}>Info Oficial</p>
          </Link>
        </button>
      )}

      <button className={styles.optionNav}>
        <Link to={"/fanon"} style={{ color: "white", textDecoration: "none" }}>
          Info Fanon
        </Link>
      </button>
      {actualPage !== "images" && (
        <button className={styles.optionNav}>
          <Link
            to={"/images"}
            style={{ color: "white", textDecoration: "none" }}
          >
            Imagenes
          </Link>
        </button>
      )}

      <button className={`${styles.optionNav} ${styles.optionNavLast}`}>
        <Link
          to={"/featured"}
          style={{ color: "white", textDecoration: "none" }}
        >
          Destacado
        </Link>
      </button>
    </div>
  );
}
