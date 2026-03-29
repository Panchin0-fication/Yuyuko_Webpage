import styles from "./css/ContentTable.module.css";
export default function ContentTable({ className, children }) {
  return (
    <div className={`${styles.tableContent} ${className}`}>{children}</div>
  );
}
