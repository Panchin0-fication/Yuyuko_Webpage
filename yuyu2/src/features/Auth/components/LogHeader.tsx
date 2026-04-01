import styles from "./css/LogHeader.module.css";
export default function LogHeader({ title }: { title: string }) {
  return (
    <header className={styles.loginHeader}>
      <h1>{title}</h1>
      <img
        className={styles.image}
        src="/staticImgs/generalUse/Yuyukokkuri.png"
        alt=""
      />
    </header>
  );
}
