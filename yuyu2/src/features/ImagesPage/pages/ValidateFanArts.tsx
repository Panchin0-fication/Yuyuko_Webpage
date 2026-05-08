import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { TagsInterface } from "@features";
import {
  HeaderPages,
  type fanArtReducedQuality,
  type fanArt,
  type tag,
} from "@shared";
import styles from "./css/ValidateFanArts.module.css";
export default function ValidateFanArts() {
  const [fanArtTags, setFanArtTags] = useState<tag[]>([]);
  const location = useLocation();
  const reducedData: fanArtReducedQuality = location.state.reduced;
  const fanArt: fanArt = location.state.fanArt;
  const pendingTags: string[] = location.state.pending;

  useEffect(() => {
    var actualTags: tag[] = [];
    actualTags = actualTags.concat(
      fanArt.artists.map((tag) => ({
        name: tag,
        category: "artist",
        status: pendingTags.includes(tag) ? "pending" : "accepted",
      })),
    );
    actualTags = actualTags.concat(
      fanArt.tags.map((tag) => ({
        name: tag,
        category: "general",
        status: pendingTags.includes(tag) ? "pending" : "accepted",
      })),
    );
    actualTags = actualTags.concat(
      fanArt.caracters.map((tag) => ({
        name: tag,
        category: "character",
        status: pendingTags.includes(tag) ? "pending" : "accepted",
      })),
    );
    setFanArtTags(actualTags);
  }, []);

  return (
    <div className={styles.validateFanArts}>
      <HeaderPages
        image="/staticImgs/generalUse/__saigyouji_yuyuko_touhou_drawn_by_y75zei__sample-9f89b813ebba2f314ea98108f9069cda.png"
        header="Validar imagen"
      />
      <br />
      <TagsInterface fanArtTags={fanArtTags} setfanArtTags={setFanArtTags} />
    </div>
  );
}
