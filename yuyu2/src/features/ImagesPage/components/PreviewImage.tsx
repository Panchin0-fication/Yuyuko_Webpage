import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { type fanArt } from "@shared";
import styles from "./css/PreviewImage.module.css";

type props = {
  closeFunc: () => void;
  increaseFunc: () => void;
  decreaseFunc: () => void;
  show: boolean;
  //For PostFanArts
  file?: string | null;
  previewRef?: any;
  PreviewLoad?: () => void;
  //For the FanArt validation
  dimensions?: { height: number; width: number };
  fanArt?: fanArt;
};
export default function PreviewImage({
  closeFunc,
  increaseFunc,
  decreaseFunc,
  show,
  file,
  previewRef,
  PreviewLoad,
  dimensions,
  fanArt,
}: props) {
  const { t } = useTranslation("images");
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef}>
      <div ref={nodeRef} className={styles.dragItem}>
        {show && (
          <>
            <header className={styles.dragHeader}>
              <p>{t("fanart_preview_text")}</p>
              <label onClick={closeFunc}>X</label>
            </header>
            <div className={styles.resizeButtons}>
              <button onClick={increaseFunc}>
                <img src="/icons/add_box.svg" alt="" />
              </button>
              <button onClick={decreaseFunc}>
                <img src="/icons/minus_box.svg" alt="" />
              </button>
            </div>
            <div className={styles.containerImg}>
              {PreviewLoad && file && (
                <img
                  onLoad={PreviewLoad}
                  ref={previewRef}
                  src={file}
                  className={styles.draggableImg}
                />
              )}

              {dimensions && fanArt && (
                <img
                  height={dimensions.height}
                  width={dimensions.width}
                  src={fanArt.src}
                  className={styles.draggableImg}
                />
              )}
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
}
