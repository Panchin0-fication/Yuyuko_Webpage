import styles from "./css/TextContainer.module.css";
export default function TextContainer({ className, children }) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}
