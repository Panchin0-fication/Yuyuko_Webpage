import { type ReactNode } from "react";
type props = { children: ReactNode; title: string };
import styles from "./css/ValidateContainerAndHeader.module.css";
export default function ValidateContainerAndHeader({ children, title }: props) {
  return (
    <div className={styles.validateUser}>
      <div className={styles.container}>
        <header className={styles.validateHeader}>
          <h2>{title}</h2>
          <img src="/staticImgs/generalUse/Yuyukokkuri.png" alt="" />
        </header>
        <hr />
        <div className={styles.center}>{children}</div>
      </div>
    </div>
  );
}
