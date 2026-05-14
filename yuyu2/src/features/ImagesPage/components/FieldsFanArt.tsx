import { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import styles from "./css/FieldsFanArt.module.css";
import {
  type previewImageDimensions,
  type fieldsFanArtsInput,
  type fanArt,
} from "@shared";

type props = {
  fileRef?: React.RefObject<any>;
  file?: string | null;
  setFile?: React.Dispatch<React.SetStateAction<string | null>>;
  setPreviewImageDimensions?: React.Dispatch<
    React.SetStateAction<previewImageDimensions>
  >;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  inputs: fieldsFanArtsInput;
  setInputs: React.Dispatch<React.SetStateAction<fieldsFanArtsInput>>;
  //For the fan art validation component
  mode?: "upload" | "verify";
  fanArt?: fanArt;
};
export default function FieldsFanArt({
  fileRef,
  file,
  setFile,
  setPreviewImageDimensions,
  show,
  setShow,
  inputs,
  setInputs,
  mode = "upload",
  fanArt,
}: props) {
  const { t } = useTranslation("images");
  const [editLink, setEditLink] = useState(true);
  useEffect(() => {
    if (mode === "verify") {
      setEditLink(false);
    }
  }, []);
  const BOLD_CONFIG = <span className={styles.boldText}></span>;

  return (
    <div className={styles.inputsGrid}>
      {/*File div */}
      <div className={styles.field}>
        {mode === "upload" &&
          fileRef &&
          setFile &&
          setPreviewImageDimensions && (
            <>
              <h3>{t("header_select_file")}</h3>
              <p>{t("body_select_file_p_one")}</p>
              <p>{t("body_select_file_p_two")}</p>
              <input
                onChange={() => {
                  if (!fileRef.current) return;
                  setFile(
                    URL.createObjectURL(
                      fileRef.current.files[fileRef.current.files.length - 1],
                    ),
                  );
                  setPreviewImageDimensions({
                    width: 0,
                    height: 0,
                    multiplier: 1.0,
                  });
                  setShow(true);
                }}
                ref={fileRef}
                className={styles.inputFile}
                type="file"
                accept=".png, .jpg, .jpeg"
              />
              <div className={`${styles.uploadFanArtButtons}`}>
                <button
                  className={`${styles.button} ${styles.buttonLoad}`}
                  onClick={async () => {
                    await fileRef.current.click();
                  }}
                >
                  <p>{t("button_select_file")}</p>
                </button>
                {file && (
                  <button onClick={() => setShow(!show)}>
                    {show && (
                      <img
                        className={` ${styles.preview}`}
                        src="/icons/minus_box.svg"
                      />
                    )}
                    {!show && (
                      <img
                        className={`${styles.preview}`}
                        src="/icons/add_box.svg"
                      />
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        {mode === "verify" && fanArt && (
          <>
            <h3>{t("header_uploaded_file")}</h3>
            <div className={styles.mySpace} />
            <Trans
              t={t}
              i18nKey={"provided_image_p"}
              components={{
                bold: <span className={styles.boldText}></span>,
                paragraph: <p></p>,
              }}
              values={{
                username: fanArt.uploader.username,
              }}
            />
            <div className={styles.mySpace} />
            <button
              className={`${styles.button} ${styles.buttonLoad}`}
              onClick={() => {
                setShow(!show);
              }}
            >
              <p>{show ? t("hide_button") : t("show_button")}</p>
            </button>
          </>
        )}
      </div>
      {/*Clasification div */}
      <div className={styles.field}>
        <h3>{t("header_select_clasification")}</h3>
        {mode === "upload" && <p>{t("select_clasification_p_one")}</p>}
        <Trans
          t={t}
          i18nKey={"select_clasification_p_two"}
          components={{
            bold: BOLD_CONFIG,
            paragraph: <p></p>,
          }}
        />
        <Trans
          t={t}
          i18nKey={"select_clasification_p_three"}
          components={{
            bold: BOLD_CONFIG,
            paragraph: <p></p>,
          }}
        />
        <Trans
          t={t}
          i18nKey={"select_clasification_p_four"}
          components={{
            bold: BOLD_CONFIG,
            paragraph: <p></p>,
          }}
        />
        {mode === "verify" && <p>{t("select_clasification_p_five")}</p>}
        <select
          value={inputs.clasification}
          onChange={(e) => {
            setInputs({
              ...inputs,
              clasification: e.target.value as
                | "general"
                | "sensitive"
                | "explicit",
            });
          }}
          className={`${styles.button} ${styles.buttonLoad}`}
        >
          <option>General</option>
          <option>Sensitive</option>
          <option>Explicit</option>
        </select>
      </div>
      {/*Original Link div */}
      <div className={styles.field}>
        <h3>{t("header_enter_link")}</h3>
        <p>{t("body_enter_link_p_one")}</p>
        <p>{t("body_enter_link_p_two")}</p>
        <p>{t("body_enter_link_p_three")}</p>
        <div className={styles.linkInput}>
          <input
            className={styles.originalLink}
            value={inputs.originalLink}
            onChange={(e) =>
              setInputs({ ...inputs, originalLink: e.target.value })
            }
            type="url"
            disabled={!editLink}
          />
          {mode === "verify" && (
            <div
              className={`${styles.editLinkButton} ${editLink ? styles.enableEdit : ""}`}
            >
              <img
                onClick={() => setEditLink(!editLink)}
                src="/icons/edit.svg"
                alt=""
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
