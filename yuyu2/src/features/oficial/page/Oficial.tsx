import { useTranslation } from "react-i18next";
import {
  HeaderPages,
  NavSecondary,
  ContentTable,
  TextContainer,
  ImagesWiki,
} from "@shared";
import styles from "./Oficial.module.css";
export default function Oficial() {
  const { t } = useTranslation("wikis");
  return (
    <div className="container">
      <HeaderPages
        image="/staticImgs/generalUse/touhou-saigyouji-yuyuko.gif"
        header={t("header_official")}
      />

      <div className={styles.content}>
        <NavSecondary actualPage="oficial" />

        <div className={styles.sectionOne}>
          <ContentTable className={styles.container}>
            <h3 className="titulo">Contenido</h3>

            <a href="#seccion1">1-Información general</a>
            <a className={styles.subContent} href="#seccion1.1">
              1.1-Diseño
            </a>
            <a className={styles.subContent} href="#seccion1.2">
              1.2-Habilidades
            </a>
            <a className={styles.subContent} href="#seccion1.3">
              1.3-Personalidad
            </a>
            <a href="#seccion2">2-Transfondo</a>
            <a href="#seccion3">3-Apariciones</a>
            <a className={styles.subContent} href="#seccion3.1">
              3.1-Juegos
            </a>
            <a className={styles.subContent} href="#seccion3.2">
              3.2-Mangas/Literatura
            </a>
            <a href="#seccion4">4-Relaciones con personajes</a>
            <a className={styles.subContent} href="#seccion4.1">
              4.1-Youmu Konpaku
            </a>
            <a className={styles.subContent} href="#seccion4.2">
              4.2-Yukari Yakumo
            </a>
            <a href="#seccion5">5-Imagenes destacadas</a>
          </ContentTable>
          <TextContainer>
            <h1 id="seccion1">Informacion general</h1>
            <h2 id="seccion1.1">Diseño</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
              aspernatur dolorum voluptates, doloremque impedit quas
              exercitationem! Maiores deserunt vero quisquam in nisi porro nulla
              accusamus repellat quos sequi. Ullam quis non suscipit expedita
              ut! Suscipit ipsum ea aperiam recusandae enim quas nesciunt
              impedit esse eos in? Ipsa aliquid molestiae temporibus possimus
              iste suscipit accusantium culpa sint maiores quod, mollitia
              delectus.
            </p>
            <h2 id="seccion1.2">Habilidades</h2>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic ea
              voluptate mollitia vitae distinctio dolorum vero possimus
              laudantium aspernatur obcaecati alias cupiditate, voluptatem
              facilis dolor culpa quia sunt libero nostrum ratione corporis!
              Ipsam rerum accusamus accusantium quod quam sit enim eos
              necessitatibus ipsa. Voluptatum tempore nostrum iusto minima, quos
              molestias exercitationem hic, numquam vero veniam laborum
              consectetur illo voluptatem dicta!
            </p>
            <h2 id="seccion1.3">Personalidad</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              tempora porro necessitatibus, eveniet quod a veritatis adipisci
              magni accusantium! Debitis unde voluptates, perspiciatis ad autem
              ut iusto. Explicabo, adipisci minus, rerum deserunt quae ad harum
              quo corrupti ex iure, maxime optio perferendis. Omnis suscipit
              perspiciatis sequi voluptates, nostrum saepe a eum sapiente nihil
              doloremque pariatur ratione sunt quam velit commodi.
            </p>
          </TextContainer>
          <ImagesWiki
            src="/staticImgs/generalUse/200px-Th07Yuyuko.png"
            text="Sprite de Perfect Cherry Blossom"
          ></ImagesWiki>
        </div>
        <div className={styles.sectionTwo}>
          <ImagesWiki
            src="/staticImgs/generalUse/Th07ayakashi01.png"
            text="Saigyou Ayakashi"
            classImage={styles.saigyouAyakashi}
          ></ImagesWiki>
          <TextContainer>
            <h1 id="seccion2">Transfondo</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
              sequi ea voluptatibus quae, fugit doloribus aliquid ullam enim
              corrupti iure maiores optio magni in inventore placeat qui
              sapiente facere provident, necessitatibus, excepturi quia. Culpa
              exercitationem inventore, excepturi nulla aperiam tenetur impedit
              deserunt recusandae illum assumenda nesciunt reiciendis cupiditate
              soluta magni delectus eum veniam fugit est, vel quisquam molestias
              natus quibusdam?
            </p>
          </TextContainer>
        </div>
        <div className={styles.sectionThree}>
          <TextContainer>
            <h1 id="seccion3">Apariciones</h1>
            <h2 id="seccion3.1">Juegos</h2>
            <p>
              -<a href="">Perfect Cherry Blossom</a>: Lorem ipsum dolor sit,
              amet consectetur adipisicing elit. Nemo sit perferendis asperiores
              sint hic assumenda similique laudantium rem nostrum dignissimos
              corporis sequi animi quisquam, neque consequatur architecto
              dolorem nam quae atque. Blanditiis, laudantium eligendi. Fuga
              magni optio maiores nobis commodi exercitationem, iure aperiam, ea
              illo rerum, nostrum molestias quidem. Accusantium!
            </p>
            <p>
              -<a href="">Imperishable Night</a>: Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Voluptatibus, eaque animi
              consectetur consequuntur fugiat dolores hic voluptate temporibus
              odio similique fugit! Tenetur modi animi omnis, possimus
              laboriosam molestias iste quam obcaecati blanditiis maxime
              repudiandae ipsum praesentium temporibus dolorum error id rerum
              sunt vitae quaerat, porro odit veritatis quos deleniti
              dignissimos.
            </p>
            <p>
              -<a href="">Ten Desires</a>: Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Animi explicabo laboriosam veniam
              aperiam iste amet in maiores, hic molestiae laborum praesentium
              nam rem optio accusamus ex qui numquam vero minima doloremque
              pariatur alias modi ab eos! Nesciunt a accusantium rem dolor non
              facere, sapiente quis facilis impedit atque voluptate repudiandae?
            </p>
            <p>
              -<a href="">Immaterial and Missing Power</a>: Lorem ipsum dolor
              sit amet, consectetur adipisicing elit. Repellat nobis dignissimos
              unde tenetur! Eaque, corrupti alias consequuntur quisquam
              voluptate asperiores adipisci nulla consectetur tempore totam.
              Quia, veniam odio porro sunt sequi nulla sint repellendus magnam!
            </p>
            <p>
              -<a href="">Shoot the Bullet</a>: Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Eum quas, quisquam minima illo
              tenetur cumque commodi ab neque. Assumenda, sequi?
            </p>
            <p>
              -<a href="">Scarlet Weather Rhapsody</a>: Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Dolor cum culpa consequatur ut
              voluptatibus reiciendis totam! Modi amet placeat excepturi unde
              rerum officia error numquam.
            </p>
            <p>
              -<a href="">Touhou Hisoutensoku</a>: Lorem ipsum dolor sit, amet
              consectetur adipisicing elit. Aperiam, optio corporis consequatur
              voluptates, odit quas non ad delectus, quae nihil illo quam
              tempore minus odio?
            </p>
            <p>
              -<a href="">Hopeless Masquerade</a>: Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Dicta non omnis itaque, veniam qui,
              deserunt ut delectus sunt nisi unde quae tempora repellat
              consectetur voluptate!
            </p>
            <p>
              -<a href="">Impossible Spell Card</a>: Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Pariatur expedita tenetur, ut labore
              provident incidunt cum quos fugiat vero nemo.
            </p>
            <h2 id="seccion3.2">Mangas</h2>
            <p>
              - <a href="">Silent Sinner in Blue</a>: Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Soluta neque mollitia, expedita
              cupiditate voluptatum asperiores eos, at deleniti quam eum
              molestiae inventore animi ipsam labore dignissimos iure! Officia,
              voluptates quos.
            </p>
            <p>
              -<a href="">Foul Detective Satori</a>: Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Deserunt quos ab voluptatibus vitae
              nihil explicabo incidunt dolores quia cum. Earum laborum
              laboriosam optio delectus nobis ipsam saepe expedita, cupiditate
              eum!
            </p>
            <p>
              -<a href="">Whispered Oracle of Hakurei Shrine</a>: Lorem ipsum,
              dolor sit amet consectetur adipisicing elit. Voluptatibus nostrum
              recusandae sed ducimus. Totam necessitatibus repellendus, at illo
              facere, quos, vel deleniti laboriosam alias nulla pariatur nemo
              soluta aut natus?
            </p>
            <p>
              -<a href="">Strange and Bright Nature Deity</a>: Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Quidem, asperiores
              veritatis? Nihil rerum unde, soluta corrupti in deleniti pariatur
              tempora alias expedita tempore cumque amet commodi mollitia
              deserunt quia perspiciatis!
            </p>
          </TextContainer>
          <div className={styles.twoImagesContainer}>
            <ImagesWiki
              src="/staticImgs/generalUse/MV5BOGViZjY3ZTgtNzhiYS00NjEyLWFkMGEtNTgwZDFkMDgyODYxXkEyXkFqcGc@._V1_QL75_UY207_CR35,0,140,207_.jpg"
              text="Touhou 7: Perfect Cherry Blossom"
            />
            <ImagesWiki
              src="/staticImgs/generalUse/Th08.png"
              text="Touhou 8: Imperishable Night"
              classImage={styles.touhou8}
            />
          </div>
        </div>
        <div className={styles.sectionFour}>
          <ImagesWiki
            src="/staticImgs/generalUse/200px-Th07Youmu.png"
            text="Sprite de Youmu en Touhou 7"
            classImage={styles.youmu}
          />
          <ImagesWiki
            src="/staticImgs/generalUse/200px-Th07Yukari.png"
            text="Sprite de Yukari en Touhou 7"
            classImage={styles.yukari}
          />
          <TextContainer>
            <h1 id="seccion4">Relaciones</h1>
            <h2 id="seccion4.1">Youmu Konpaku</h2>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia
              et eius dolore distinctio delectus labore amet accusamus quod
              tempora cupiditate totam nobis ab aut cum dicta dignissimos
              placeat corrupti, veniam, quibusdam incidunt corporis? Totam
              laborum neque fugit excepturi, id quaerat voluptas vero dolorum,
              atque doloremque similique nulla dolor eos ut sit corrupti,
              aspernatur eaque! Distinctio?
            </p>
            <h2 id="seccion4.2">Yukari Yakumo</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
              quod perferendis quia quisquam blanditiis libero, aliquam
              voluptate assumenda, rem aliquid a optio at delectus recusandae
              praesentium veniam commodi natus iusto excepturi accusantium
              beatae voluptatum tenetur esse similique? Magni, iure incidunt hic
              consectetur perspiciatis perferendis earum esse quasi atque eum
              sapiente enim, rem animi ducimus itaque.
            </p>
          </TextContainer>
        </div>
        <div className={styles.sectionFive}>
          <TextContainer>
            <h1 id="seccion5">Imagenes destacadas</h1>
          </TextContainer>
          <div className={styles.sectionFiveImages}>
            <ImagesWiki
              src="/staticImgs/generalUse/actual-drawings-made-by-zuns-wife-v0-faha70qce0ae1.jpg"
              text="Yuyuko dibujada en Gartic Phone durante un stream entre Zun y sus
            amigotes"
              classImage={styles.garticOne}
            />
            <ImagesWiki
              src="/staticImgs/generalUse/Captura de pantalla 2025-07-09 163832.png"
              text="Yuyuko dibujada por la esposa de Zun en Gartic Phone"
              classImage={styles.garticTwo}
            />
            <ImagesWiki
              src="/staticImgs/generalUse/Th08Yuyuko.png"
              text="Sprite de Yuyuko en Touhou 8:Imperishable Night"
              classImage={styles.yuyukoth08}
            />
            <ImagesWiki
              src="/staticImgs/generalUse/yuyukoYyoumu.png"
              text="Yuyuko y Youmu en Strange and Bright Nature Deity"
              classImage={styles.yuyukoYoumu}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
