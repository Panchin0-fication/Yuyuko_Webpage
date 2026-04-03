import { HeaderPages, NavSecondary } from "@shared";
import styles from "./css/FrontImages.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FrontImages() {
  const [over, setOver] = useState<"sprites" | "mangas" | "fanArts" | "">("");
  const navigate = useNavigate();
  function handleMouseOver(option: "sprites" | "mangas" | "fanArts"):void {
    setOver(option);
  }
  function handleMouseOut():void {
    setOver("");
  }
  function handleClick(option: "sprites" | "mangas" | "fanArts") {
    navigate(`/${option}`);
  }
  return (
    <div>
      <HeaderPages image="/staticImgs/generalUse/yuyuko-touhou.gif" />
      <NavSecondary actualPage="images" classNameExtra={styles.navCentered} />
      <div className={styles.imagesPages}>
        <button
          onMouseOverCapture={():void => handleMouseOver("sprites")}
          onMouseOut={handleMouseOut}
          className={`${styles.pageOption}`}
          onClick={():void => handleClick("sprites")}
        >
          <img src="/staticImgs/generalUse/Portada1.jpg" alt="" />
          {over === "sprites" && (
            <p className={styles.textOver}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
              sequi distinctio voluptate asperiores quos facilis ipsam cum
              numquam voluptas beatae, fugiat maiores natus quae tempore
              nostrum, nulla nesciunt illum molestiae?
            </p>
          )}
          <p className={styles.bottomText}>Sprites</p>
        </button>
        <button
          className={`${styles.pageOption}`}
          onMouseOverCapture={():void => handleMouseOver("mangas")}
          onMouseOut={handleMouseOut}
          onClick={():void => handleClick("mangas")}
        >
          <img src="/staticImgs/generalUse/pmiss_yuyuko.jpg" alt="" />
          {over === "mangas" && (
            <p className={styles.textOver}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error
              sed corporis iusto ipsa exercitationem impedit veritatis in quis
              accusamus. Atque tempora iure, vero alias illo provident
              repudiandae eos nulla placeat.
            </p>
          )}
          <p className={styles.bottomText}>Mangas</p>
        </button>
        <button
          className={`${styles.pageOption}`}
          onMouseOverCapture={():void => handleMouseOver("fanArts")}
          onMouseOut={handleMouseOut}
          onClick={():void => handleClick("fanArts")}
        >
          <img
            src="/staticImgs/generalUse/__saigyouji_yuyuko_touhou_drawn_by_r9nr9__d922a533458f7883c6d88ffd21299284.jpg"
            alt=""
          />
          {over === "fanArts" && (
            <p className={styles.textOver}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
              optio enim ipsum deleniti nihil quod neque ad sapiente quisquam
              sit necessitatibus odit, eveniet repellat placeat ullam natus
              excepturi, exercitationem non!
            </p>
          )}
          <p className={styles.bottomText}>Fan Arts</p>
        </button>
      </div>
    </div>
  );
}
