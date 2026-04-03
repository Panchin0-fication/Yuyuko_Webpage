import { Link } from "react-router-dom";
import styles from "./css/HeaderPage.module.css";
type props = {
  image: string
  isInPage?: boolean
}
export default function HeaderPage({ image, isInPage = false }:props) {
  return (
    <>
      <div className={styles.headerPages}>
        <img className={styles.headerImage} src={image} alt="" />
        <h2 className={styles.title}>Yuyuko Saigyouji</h2>
        <button className={styles.iconHouse}>
          {isInPage && (
            <Link
              to={"/images"}
              style={{ color: "white", textDecoration: "none" }}
            >
              <img className={styles.icon} src="/icons/door_open.svg" alt="" />
            </Link>
          )}
          <Link to={"/"} style={{ color: "white", textDecoration: "none" }}>
            <img className={styles.icon} src="/icons/home.svg" alt="" />
          </Link>
        </button>
      </div>

      <div className={styles.borderBottom}></div>
    </>
  );
}
