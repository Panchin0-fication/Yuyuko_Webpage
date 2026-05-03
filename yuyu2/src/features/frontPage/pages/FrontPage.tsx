import { Nav, YuyuInfo, InfoWebpage, Footer } from "@features";
import styles from "./css/FrontPage.module.css";
export default function FrontPage() {
  return (
    <div>
      <header className={styles.headerMain}>
        <h1>Yuyuko Saigyouji</h1>
      </header>

      <Nav></Nav>
      <div>
        <YuyuInfo />
        <InfoWebpage />
      </div>
      <Footer />
    </div>
  );
}
