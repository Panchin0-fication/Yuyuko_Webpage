import { type ReactNode } from "react";
import styles from "./css/ContentTable.module.css";
type props = {
  className: string;
  children: ReactNode;
}
export default function ContentTable({ className, children }:props) {
  return (
    <div className={`${styles.tableContent} ${className}`}>{children}</div>
  );
}
