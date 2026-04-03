import { useTranslation } from "react-i18next";
import {type endingSprite} from "@shared"
import styles from "./css/ImageSpoiler.module.css";

type props = {
  src:string;
  endings:endingSprite[]
  ending:endingSprite
  setEndings: React.Dispatch<React.SetStateAction<endingSprite[]>>
}
export default function ImageSpoiler({ src, endings, ending, setEndings }:props) {
  const {t} = useTranslation("images");
  function handleClick() {
    const newEndings = endings.map((end) => {
      if (end.id === ending.id) {
        return { ...end, hidden: false };
      } else {
        return end;
      }
    });
    setEndings(newEndings);
  }

  return (
    <div className={styles.ending}>
      <img
        src={src}
        className={`${ending.hidden ? styles.spoiler : ""} ${styles.imageEnding}`}
      ></img>
      <button
        className={!ending.hidden ? styles.hide : ""}
        onClick={() => handleClick()}
      >
        <p className={styles.spoilerTag}>{t("spoiler_label")}</p>
      </button>
    </div>
  );
}
