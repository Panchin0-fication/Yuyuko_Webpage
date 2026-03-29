import styles from "./css/InfoWebpage.module.css";
export default function InfoWebPage() {
  return (
    <>
      <div className={styles.textBox}>
        <img src="/staticImgs/generalUse/yuyuko-yuyuko-saigyouji.gif" alt="" />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum amet
          atque ullam sit aperiam repellendus corrupti id tempora omnis
          veritatis, adipisci alias dolores sequi laborum consectetur ea odio
          quibusdam natus. Magnam temporibus iste quia eum. Asperiores,
          aspernatur? Officiis numquam corrupti sit natus id ab ipsam eius fugit
          error possimus illo odio at non ipsum aliquam corporis laudantium
          dolores pariatur, consequuntur odit. Consequatur repellendus illum
          eius tempora officia eligendi quae autem.
        </p>
      </div>
      <div className={styles.sections}>
        <div className={`${styles.section} ${styles.info}`}>
          <h1>Información</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
            obcaecati ratione omnis nemo vitae illum molestiae consequuntur
            laboriosam eveniet fugiat.
          </p>
        </div>
        <div className={`${styles.section} ${styles.images}`}>
          <h1>Imagenes</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            eligendi nesciunt ex delectus. Provident culpa hic totam eaque, nemo
            atque.
          </p>
        </div>
        <div className={`${styles.section} ${styles.extras}`}>
          <h1>Extras</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
            modi doloremque error nostrum vitae voluptate libero quae unde
            molestias commodi.
          </p>
        </div>
      </div>
    </>
  );
}
