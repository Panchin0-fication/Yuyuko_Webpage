import { TextContainer, type endingSprite } from "@shared";
import styles from "./css/TitleSprites.module.css";
import { useState } from "react";
type props = {
  title:string;
  info:string;
  credits:string;
  id:string;
  endings?:endingSprite[] | null
  setEndings?: React.Dispatch<React.SetStateAction<endingSprite[]>> | null
  
}
export default function TitleSprites({
  title,
  info,
  credits,
  id,
  endings = null,
  setEndings = null,
}:props) {
  const [arrow, setArrow] = useState(false);

  //This funtion remove the spoiler from any of the sprites in endings section
  function handleShowAll() {
    if(!setEndings || !endings)return;
    const newEndings:endingSprite[] = endings.map((end) => {
      return { ...end, hidden: false };
    });
    setEndings(newEndings);
  }
  return (
    <>
      <div className={styles.titleSprites} id={id}>
        <h1>{title}</h1>
        <button
          onClick={() => {
            setArrow(!arrow);
          }}
        >
          <img
            className={arrow ? styles.inverted : ""}
            src="/icons/arrow_down.svg"
            alt=""
          />
        </button>
        {/* if an ending is passed then it is because is the endings section */}
        {endings && (
          <button onClick={() => handleShowAll()}>
            <img src="icons/visibility_off.svg" />
          </button>
        )}
      </div>
      <TextContainer
        className={`${styles.infoSprites} ${arrow ? styles.hidden : ""}`}
      >
        <img src="/icons/info_circle.svg" alt="" />
        <p>{info}</p>
        <img src="/icons/person.svg" alt="" />
        <p>{credits}</p>
      </TextContainer>
    </>
  );
}
