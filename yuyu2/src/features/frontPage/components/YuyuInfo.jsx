import styles from "./css/YuyuInfo.module.css";
export default function YuyuInfo() {
  return (
    <div className={styles.yuyuInfo}>
      <div className={styles.imageInfo}></div>
      <div className={styles.bodyText}>
        <h2>Princesa fantasmal del inframundo</h2>
        <p>
          Yuyuko Saigyouji es un personaje de la serie de videojuegos
          "shoot-'em-up" de Touhou Project; ella aparece por primera vez en
          "Touhou 7 Perfect Cherry Blossom" ultimo jefe del juego, despues a
          aparecido en otros medios de Touhou como personaje secundario en
          mangas oficiales y en otros videojuegos.
        </p>
        <p>
          Ella es la prinsasa fantasmal del inframundo por lo que tiene poderes
          para manipular la muerte; es de personalidad despreocupada y de buen
          humor, finje ser torpe y despistada pero a demostrado varias veces que
          es mucho más inteligente de lo que quiere aparentar. Normalmete esta
          acompañada de Youmu Konpaku la cual es su jardinera y guardaespaldas.
        </p>
      </div>
      <div className={styles.imageInfo}></div>
    </div>
  );
}
