import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeaderPages, NavSecondary } from "@shared";
import styles from "./css/FrontImages.module.css";

export default function FrontImages() {
  const { t } = useTranslation("images");
  const [over, setOver] = useState<"sprites" | "mangas" | "fanArts" | "">("");
  const navigate = useNavigate();
  function handleMouseOver(option: "sprites" | "mangas" | "fanArts"): void {
    setOver(option);
  }
  function handleMouseOut(): void {
    setOver("");
  }
  function handleClick(option: "sprites" | "mangas" | "fanArts") {
    navigate(`/${option}`);
  }
  return (
    <div>
      <HeaderPages
        image="/staticImgs/generalUse/yuyuko-touhou.gif"
        header={t("header_front")}
      />
      <NavSecondary actualPage="images" classNameExtra={styles.navCentered} />
      <div className={styles.imagesPages}>
        <button
          onMouseOverCapture={(): void => handleMouseOver("sprites")}
          onMouseOut={handleMouseOut}
          className={`${styles.pageOption}`}
          onClick={(): void => handleClick("sprites")}
        >
          <img src="/staticImgs/generalUse/Portada1.jpg" alt="" />
          {over === "sprites" && (
            <p className={styles.textOver}>{t("sprites_page_info")}</p>
          )}
          <p className={styles.bottomText}>{t("sprites_page_header")}</p>
        </button>
        <button
          className={`${styles.pageOption}`}
          onMouseOverCapture={(): void => handleMouseOver("mangas")}
          onMouseOut={handleMouseOut}
          onClick={(): void => handleClick("mangas")}
        >
          <img src="/staticImgs/generalUse/pmiss_yuyuko.jpg" alt="" />
          {over === "mangas" && (
            <p className={styles.textOver}>{t("mangas_page_info")}</p>
          )}
          <p className={styles.bottomText}>{t("mangas_page_header")}</p>
        </button>
        <button
          className={`${styles.pageOption}`}
          onMouseOverCapture={(): void => handleMouseOver("fanArts")}
          onMouseOut={handleMouseOut}
          onClick={(): void => handleClick("fanArts")}
        >
          <img
            src="/staticImgs/generalUse/__saigyouji_yuyuko_touhou_drawn_by_r9nr9__d922a533458f7883c6d88ffd21299284.jpg"
            alt=""
          />
          {over === "fanArts" && (
            <p className={styles.textOver}>{t("fanarts_page_info")}</p>
          )}
          <p className={styles.bottomText}>{t("fanarts_page_header")}</p>
        </button>
      </div>
    </div>
  );
}
