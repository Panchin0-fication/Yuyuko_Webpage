import styles from "./css/ImagesWiki.module.css";
export default function WikiImages({ src, text, classImage }) {
  return (
    <div className={styles.image}>
      <img className={classImage} src={src} alt="" />
      <p>{text}</p>
    </div>
  );
}
