import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TagsInterface, FieldsFanArt, PreviewImage } from "@features";
import {
  HeaderPages,
  type fanArtReducedQuality,
  type fanArt,
  type tag,
  type change,
  type fieldsFanArtsInput,
} from "@shared";
import styles from "./css/ValidateFanArts.module.css";
export default function ValidateFanArts() {
  const location = useLocation();
  const fanArt: fanArt = location.state.fanArt;

  const [show, setShow] = useState(false);
  const [fields, setFields] = useState<fieldsFanArtsInput>({
    clasification: fanArt.clasification,
    originalLink: fanArt.originalLink,
  });
  //Verified tags
  const [fanArtTags, setFanArtTags] = useState<tag[]>([]);
  //Unverified tags
  const [unVerTags, setUnVerTags] = useState<tag[]>([]);
  //Recornds of changes
  const [changesRecords, setChangesRecords] = useState<change[]>([]);

  const reducedData: fanArtReducedQuality = location.state.reduced;

  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  if (reducedData) {
    useEffect(() => {
      setDimensions({
        height: reducedData.height / 3,
        width: reducedData.width / 3,
      });
    }, []);
  }

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
      <FieldsFanArt
        mode="verify"
        show={show}
        setShow={setShow}
        inputs={fields}
        setInputs={setFields}
        fanArt={fanArt}
      />
      <PreviewImage
        closeFunc={() => setShow(false)}
        increaseFunc={() =>
          setDimensions({
            height: dimensions.height * 1.05,
            width: dimensions.width * 1.05,
          })
        }
        decreaseFunc={() =>
          setDimensions({
            height: dimensions.height * 0.95,
            width: dimensions.width * 0.95,
          })
        }
        show={show}
        dimensions={dimensions}
        fanArt={fanArt}
      />
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
