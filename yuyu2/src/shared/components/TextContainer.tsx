import { type ReactNode } from "react";
import styles from "./css/TextContainer.module.css";
type props = {
  className?:string | null;
  children: ReactNode
}
export default function TextContainer({ className, children=null }:props) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}
