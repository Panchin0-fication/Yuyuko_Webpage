import { type ReactNode } from "react";
import styles from "./css/LogContainer.module.css";
export default function LogContainer({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.element}`}>
      <div className={styles.fields}>{children}</div>
    </div>
  );
}
