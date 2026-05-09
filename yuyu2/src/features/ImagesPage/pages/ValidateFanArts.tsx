import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { TagsInterface } from "@features";
import {
  HeaderPages,
  type fanArtReducedQuality,
  type fanArt,
  type tag,
  type change,
} from "@shared";
import styles from "./css/ValidateFanArts.module.css";
export default function ValidateFanArts() {
  const location = useLocation();
  //Verified tags
  const [fanArtTags, setFanArtTags] = useState<tag[]>([]);
  //Unverified tags
  const [unVerTags, setUnVerTags] = useState<tag[]>([]);
  //Recornds of changes

  const [changesRecords, setChangesRecords] = useState<change[]>([]);

  const reducedData: fanArtReducedQuality = location.state.reduced;
  const fanArt: fanArt = location.state.fanArt;

  useEffect(() => {
    setUnVerTags(location.state.pending);
    setFanArtTags(location.state.verified);
  }, []);

  return (
    <div className={styles.validateFanArts}>
      <HeaderPages
        image="/staticImgs/generalUse/__saigyouji_yuyuko_touhou_drawn_by_y75zei__sample-9f89b813ebba2f314ea98108f9069cda.png"
        header="Validar imagen"
      />
      <br />
      <TagsInterface
        fanArtTags={fanArtTags}
        setfanArtTags={setFanArtTags}
        unVerTags={unVerTags}
        setUnVerTags={setUnVerTags}
        changesRecords={changesRecords}
        setChangesRecords={setChangesRecords}
      />
    </div>
  );
}
