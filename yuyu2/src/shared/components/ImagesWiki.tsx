import styles from "./css/ImagesWiki.module.css";
type props = {
  src: string;
  text: string;
  classImage?: string;
};
export default function WikiImages({ src, text, classImage }: props) {
  return (
    <div className={styles.image}>
      <img className={classImage} src={src} alt="" />
      <p>{text}</p>
    </div>
  );
}
