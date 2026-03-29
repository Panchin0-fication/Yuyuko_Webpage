import { useState } from "react";
import { HeaderPages, ContentTable, TextContainer } from "@shared";
import { TitleSprites, ImageSpoiler } from "@features";
import styles from "./css/Sprites.module.css";
export default function Sprites() {
  const [endings, setEndings] = useState([
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
        ></HeaderPages>
        <a href="#inicio" className="flecha-inicio">
          <img className={styles.arrow} src="/icons/arrow_warm_up.svg" alt="" />
        </a>
      </header>
      <br />
      <div className={styles.pageContents}>
        <div className={styles.sectionOne}>
          <ContentTable className={styles.container}>
            <h3>Contenido</h3>
            <a href="#gameplay">1-Gameplay</a>
            <a href="#seleccion">2-Seleccion de personaje</a>
            <a href="#dialogos">3-Dialogos</a>
            <a href="#finales">4-Finales</a>
            <a href="#fondos">5-Fondos</a>
            <a href="#otros">6-Otros</a>
          </ContentTable>
          <TextContainer>
            <h1>Sprites</h1>
            <p>
              texto explicando como esta organizados los sprites Lorem ipsum
              dolor sit, amet consectetur adipisicing elit. Accusantium, beatae
              voluptates! Sapiente illum nisi unde placeat nemo odio rerum autem
              amet? Provident ratione aliquam laborum possimus, nihil unde iusto
              hic.
            </p>
          </TextContainer>
        </div>
        <TitleSprites
          id="gameplay"
          title="Gameplay"
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
          title="Selección de personaje"
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
          title="Dialogos"
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
          title="Finales"
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
          title="Fondos"
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
          title="Otros"
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
/*

        <div class="titulo-sprites" id="fondos">
            <h1>Fondos</h1>
            <i class="fa-solid fa-caret-down boton-fondos boton"></i>
        </div>
        <div class="Sprite-fondos parte">
            <div class="info texto fondos-texto show">
                <div class="parte-info">
                    <i class="fa-solid fa-circle-info "></i>
                    <p class="info-jugable">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa nostrum in, dolores deserunt eveniet atque quibusdam molestiae harum vitae alias facilis ab rem, dicta iure quo quasi voluptate! Nisi, harum laboriosam, vero ipsam quis molestiae molestias cupiditate eius ipsa, nam autem totam odio modi reprehenderit ducimus tempora non quae deserunt?</p>
                </div>
                <div class="parte-creditos">
                    <i class="fa-solid fa-child"></i>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia aspernatur voluptate atque pariatur voluptas hic natus autem! Iusto optio earum repellendus assumenda eveniet soluta vero, eligendi porro recusandae quam illum?</p>
                </div>
            </div>
            <div class="imagenes">
                <img class="sprite" src="img/Sprites/Sprites-touhou7-fondos-EDIT.png" alt="">
                <img class="sprite" src="img/Sprites/Sprites-touhou10.5-fondo.png" alt="">
                <img class="sprite" src="img/Sprites/Sprites-touhou12.3-fondo.png" alt="">
            </div>
        </div>

        <div class="titulo-sprites" id="otros">
            <h1>Otros</h1>
            <i class="fa-solid fa-caret-down boton-otros boton"></i>
        </div>
        <div class="Sprite-otros parte">
            <div class="info texto otros-texto show">
                <div class="parte-info">
                    <i class="fa-solid fa-circle-info "></i>
                    <p class="info-jugable">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa nostrum in, dolores deserunt eveniet atque quibusdam molestiae harum vitae alias facilis ab rem, dicta iure quo quasi voluptate! Nisi, harum laboriosam, vero ipsam quis molestiae molestias cupiditate eius ipsa, nam autem totam odio modi reprehenderit ducimus tempora non quae deserunt?</p>
                </div>
                <div class="parte-creditos">
                    <i class="fa-solid fa-child"></i>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia aspernatur voluptate atque pariatur voluptas hic natus autem! Iusto optio earum repellendus assumenda eveniet soluta vero, eligendi porro recusandae quam illum?</p>
                </div>
            </div>
            <div class="imagenes">
                <img class="sprite" src="img/Sprites/Sprites-touhou8-loading-EDIT.png" alt="">
                <img class="sprite" src="img/Sprites/sprites-touhou13.5-defondo-EDIT.png" alt="">
                <img class="sprite" src="img/Sprites/Sprites-touhou10.5-efectos.png" alt="">
            </div>
        </div>

    </div> */
