import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HeaderPages,
  ContentTable,
  TextContainer,
  type endingSprite,
} from "@shared";
import { TitleSprites, ImageSpoiler } from "@features";
import styles from "./css/Sprites.module.css";
export default function Sprites() {
  const { t } = useTranslation("images");
  const [endings, setEndings] = useState<endingSprite[]>([
    { hidden: true, id: "ending1" },
    { hidden: true, id: "ending2" },
    { hidden: true, id: "ending3" },
    { hidden: true, id: "ending4" },
    { hidden: true, id: "ending5" },
    { hidden: true, id: "ending6" },
    { hidden: true, id: "ending7" },
    { hidden: true, id: "ending8" },
    { hidden: true, id: "ending9" },
    { hidden: true, id: "ending10" },
    { hidden: true, id: "ending11" },
    { hidden: true, id: "ending12" },
  ]);

  return (
    <div>
      <header id="inicio">
        <HeaderPages
          image="staticImgs/generalUse/mllieuuslnwa1.gif"
          isInPage={true}
          header={t("header_sprites")}
        ></HeaderPages>
        <a href="#inicio" className="flecha-inicio">
          <img className={styles.arrow} src="/icons/arrow_warm_up.svg" alt="" />
        </a>
      </header>
      <br />
      <div className={styles.pageContents}>
        <div className={styles.sectionOne}>
          <ContentTable className={styles.container}>
            <h3>{t("header_content_table")}</h3>
            <a href="#gameplay">{t("option_content_table_gameplay")}</a>
            <a href="#seleccion">
              {t("option_content_table_character_selection")}
            </a>
            <a href="#dialogos">{t("option_content_table_dialogues")}</a>
            <a href="#finales">{t("option_content_table_endings")}</a>
            <a href="#fondos">{t("option_content_table_backgrounds")}</a>
            <a href="#otros">{t("option_content_table_other")}</a>
          </ContentTable>
          <TextContainer>
            <h1>{t("header_section_general_informarion")}</h1>
            <p>{t("body_section_general_informarion")}</p>
          </TextContainer>
        </div>
        <TitleSprites
          id="gameplay"
          title={t("header_gameplay_info")}
          info="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
          credits="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
        ></TitleSprites>
        <div className={styles.sprites}>
          <img
            src="staticImgs/generalUse/Sprites-touhou7-enemigos-EDIT.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou8-juagable-EDIT.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou10.5-juego-EDIT.png"
            alt=""
          />
        </div>

        <TitleSprites
          id="seleccion"
          title={t("header_character_selection_info")}
          info="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
          credits="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
        ></TitleSprites>
        <div className={styles.sprites}>
          <img
            src="staticImgs/generalUse/Sprites-touhou8-seleccion-EDIT1.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou10.5-seleccion-EDIT2.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou10.5-seleccion-EDIT1.png"
            alt=""
          />
        </div>

        <TitleSprites
          id="dialogos"
          title={t("header_dialogues_info")}
          info="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
          credits="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
        />
        <div className={styles.sprites}>
          <img
            src="staticImgs/generalUse/Sprites-touhou7-portadas-EDIT.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou8-dialogos-EDIT.png"
            alt=""
          />
          <img
            className={styles.imgBig}
            src="staticImgs/generalUse/Sprites.touhou10.5-portadas.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou13-dialogos-EDIT.png"
            alt=""
          />
        </div>

        <TitleSprites
          id="finales"
          title={t("header_endings_info")}
          info="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
          credits="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
          endings={endings}
          setEndings={setEndings}
        />

        <div className={styles.sprites}>
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-touhou7-finales-EDIT1.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[0]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-touhou7-finales-EDIT2.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[1]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-touhou7-finales-EDIT3.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[2]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-touhou7-finales-EDIT4.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[3]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-touhou7-finales-EDIT5.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[4]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-touhou7-finales-EDIT6.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[5]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-touhou7-finales-EDIT7.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[6]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-touhou7-finales-EDIT8.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[7]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-Touhou8-finales-EDIT1.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[8]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-Touhou8-finales-EDIT2.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[9]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-Touhou8-finales-EDIT3.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[10]}
          />
          <ImageSpoiler
            src="staticImgs/generalUse/Sprites-Touhou8-finales-EDIT4.png"
            endings={endings}
            setEndings={setEndings}
            ending={endings[11]}
          />
        </div>

        <TitleSprites
          id="fondos"
          title={t("header_backgrounds_info")}
          info="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
          credits="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
        />
        <div className={styles.sprites}>
          <img
            src="staticImgs/generalUse/Sprites-touhou7-fondos-EDIT.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou10.5-fondo.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou12.3-fondo.png"
            alt=""
          />
          <img src="staticImgs/generalUse/Th13Netherworld.jpg" alt="" />
        </div>

        <TitleSprites
          id="otros"
          title={t("header_others_info")}
          info="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
          credits="Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat"
        />
        <div className={styles.sprites}>
          <img
            src="staticImgs/generalUse/Sprites-touhou8-loading-EDIT.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/sprites-touhou13.5-defondo-EDIT.png"
            alt=""
          />
          <img
            src="staticImgs/generalUse/Sprites-touhou10.5-efectos.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
