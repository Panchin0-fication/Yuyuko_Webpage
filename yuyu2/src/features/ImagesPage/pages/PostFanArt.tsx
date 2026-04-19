import { useState, startTransition, useRef, type ReactNode } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useLocation } from "react-router-dom";
import Draggable from "react-draggable";
import styles from "./css/PostFanArt.module.css";
import { TagsInterface } from "@features";
import {
  HeaderPages,
  Message,
  Profile,
  InfoMessage,
  ValidateSesion,
  type tag,
  type response,
  type fanArt,
  type withUrl,
  type previewImageDimensions,
  type withUserData,
} from "@shared";
export default function PostFanArt() {
  //Translations
  const { t } = useTranslation("images");
  const location = useLocation();
  //File ref and image preview dimensions
  const fileRef = useRef<any>([]);
  const previewRef = useRef<any>(null);
  const nodeRef = useRef(null);
  const [previewImageDimensions, setPreviewImageDimensions] =
    useState<previewImageDimensions>({
      width: 0,
      height: 0,
      multiplier: 1.0,
    });

  const [fanArtTags, setfanArtTags] = useState<tag[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<null | ReactNode>(null);
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState<{
    clasification: "general" | "sensitive" | "explicit";
    originalLink: string;
  }>({
    clasification: "general",
    originalLink: "",
  });

  const ALLOWED_DOMAINS = [
    "twitter.com",
    "x.com",
    "pixiv.net",
    "reddit.com",
    "deviantart.com",
    "instagram.com",
  ];

  const PREVIEW_MAX_DIMENSION = 300;

  const BOLD_CONFIG = <span className={styles.boldText}></span>;

  function handleMessage(
    header: string,
    text: string,
    type: "error" | "success",
  ) {
    setMessage(
      <Message
        header={header}
        text={text}
        type={type}
        setMessage={setMessage}
        toRedirect=""
      />,
    );
  }

  function uploadValidations() {
    //%% Handle errors %%
    if (!file) {
      handleMessage(
        t("message_header_error_posting"),
        t("message_body_error_posting_no_file"),
        "error",
      );
      return;
    }
    if (inputs.originalLink === "") {
      handleMessage(
        t("message_header_error_posting"),
        t("message_body_error_posting_no_link"),
        "error",
      );
      return;
    }
    //Checks if the link works and is valid
    let url: URL;
    try {
      url = new URL(inputs.originalLink);
    } catch {
      handleMessage(
        t("message_header_error_posting"),
        t("message_body_error_posting_invalid_link"),
        "error",
      );
      return;
    }
    const isDomainAllowed = ALLOWED_DOMAINS.some((domain) =>
      url.hostname.endsWith(domain),
    );
    // Check and allow direct link to images
    const isDirectImage = /\.(jpeg|jpg|png|webp|gif)(\?.*)?$/i.test(
      url.pathname,
    );
    if (!isDomainAllowed && !isDirectImage) {
      handleMessage(
        t("message_header_error_posting"),
        t("message_body_error_posting_unauthorized_domain"),
        "error",
      );
      return;
    }
    // Tags validations
    if (fanArtTags.length < 5) {
      handleMessage(
        t("message_header_error_posting"),
        t("message_body_error_not_enough_tags"),
        "error",
      );
      return;
    }
    if (
      fanArtTags.filter((tag) => tag.name === "saigyouji_yuyuko").length !== 1
    ) {
      handleMessage(
        t("message_header_error_posting"),
        t("message_body_error_not_yuyuko_tag"),
        "error",
      );
      return;
    }
    //%% Handle warnings %%
    let continueUpload = true;
    if (fanArtTags.filter((tag) => tag.category === "artist").length < 1) {
      startTransition(() => {
        continueUpload = false;
        setMessage(
          <InfoMessage
            header={t("info_message_no_artist_header")}
            onCancel={() => {
              setMessage(null);
            }}
            onContinue={() => {
              uploadFanart();
              setMessage(null);
            }}
          >
            <h2>{t("info_message_no_artist_h2")}</h2>
            <p>{t("info_message_no_artist_p_one")}</p>
            <p>{t("info_message_no_artist_p_two")}</p>
          </InfoMessage>,
        );
      });
    }
    //If there were no warnings
    if (continueUpload) uploadFanart();
  }

  async function uploadFanart(): Promise<void> {
    let fanArtObject = {} as fanArt;
    setLoading(true);

    const resUser = (await Profile(
      localStorage.getItem("token"),
    )) as withUserData;
    if (resUser.success) {
      fanArtObject["uploader"] = {
        username: resUser.user_data.userName,
        id: resUser.user_data.id,
      };
    } else {
      setMessage(
        <Message
          header={t("message_header_no_loged_in")}
          text={t("message_body_no_loged_in")}
          setMessage={setMessage}
          toRedirect={"/auth/login"}
          type="error"
          previus={{ state: { from: location.pathname } }}
        />,
      );
      return;
    }

    //Upload new tags to the database
    const newTags = fanArtTags.filter((tag) => tag.status === "pending");
    if (newTags.length >= 1) {
      const responseNewTags = await fetch(
        `${import.meta.env.VITE_API_URL}/newTags`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTags),
        },
      );
      const resNewTags = (await responseNewTags.json()) as response;
      if (!resNewTags.success) {
        handleMessage(
          t("message_header_error_posting"),
          t("message_body_unexpected_error_new_tags"),
          "error",
        );
      }
    }

    //Upload image to cloudinary
    if (!fileRef.current) return;
    const formData = new FormData();
    formData.append("file", fileRef.current.files[0]);
    formData.append("upload_preset", "images");

    const responseCloudinary = await fetch(
      `${import.meta.env.VITE_API_URL}/upload-image`,
      {
        method: "POST",
        body: formData,
      },
    );

    const resCloudinary = (await responseCloudinary.json()) as withUrl;
    fanArtObject["src"] = resCloudinary.url;

    //Filters tags to put them in the FanArt object
    var filtered: { general: string[]; artist: string[]; character: string[] } =
      { general: [], artist: [], character: [] };

    for (var tag of fanArtTags) {
      if (tag.category === "general") {
        filtered.general.push(tag.name);
      } else if (tag.category === "artist") {
        filtered.artist.push(tag.name);
      } else {
        filtered.character.push(tag.name);
      }
    }
    fanArtObject["tags"] = filtered.general;
    fanArtObject["artists"] = filtered.artist;
    fanArtObject["caracters"] = filtered.character;
    fanArtObject["clasification"] = inputs.clasification;
    fanArtObject["show"] = true;
    fanArtObject["originalLink"] = inputs.originalLink;
    fanArtObject["status"] = "pending";

    const uploadFanArt = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/newFanArt`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(fanArtObject),
        },
      );
      const res = (await response.json()) as response;
      if (res.success) {
        handleMessage(
          t("message_header_success_posting"),
          t("message_body_success"),
          "success",
        );
      }
    };
    await uploadFanArt();
    setLoading(false);
  }

  function PreviewLoad() {
    if (!previewRef.current) return;
    if (previewImageDimensions.height === 0) {
      //Original dimensions
      const clientWidth = previewRef.current.clientWidth;
      const clientHeight = previewRef.current.clientHeight;

      // New dimensions
      const preview_width =
        clientWidth / clientHeight > 1
          ? PREVIEW_MAX_DIMENSION
          : PREVIEW_MAX_DIMENSION / (clientWidth / clientHeight);
      const preview_height =
        clientWidth / clientHeight > 1
          ? PREVIEW_MAX_DIMENSION / (clientWidth / clientHeight)
          : PREVIEW_MAX_DIMENSION;

      previewRef.current.style.width = `${preview_width}px`;
      previewRef.current.style.height = `${preview_height}px`;
      setPreviewImageDimensions({
        width: preview_width,
        height: preview_height,
        multiplier: 1,
      });
    } else {
      previewRef.current.style.height = `${previewImageDimensions.height * previewImageDimensions.multiplier}px`;
      previewRef.current.style.width = `${previewImageDimensions.width * previewImageDimensions.multiplier}px`;
    }
  }

  function resizePreview(action: "+" | "-") {
    if (!previewRef.current) return;
    let newMultiplier = previewImageDimensions.multiplier;
    newMultiplier =
      action === "+" ? newMultiplier + 0.05 : newMultiplier - 0.05;

    setPreviewImageDimensions({
      ...previewImageDimensions,
      multiplier: newMultiplier,
    });

    previewRef.current.style.height = `${previewImageDimensions.height * newMultiplier}px`;
    previewRef.current.style.width = `${previewImageDimensions.width * newMultiplier}px`;
  }
  return (
    <>
      <ValidateSesion />
      <div className={`${styles.all} ${message && "filterMsg"}`}>
        <HeaderPages image={"/staticImgs/generalUse/postFanArt.jpg"} />
        <br />
        <div className={styles.content}>
          {/*Divs of inputs for FanArt fields */}
          <div className={styles.inputsGrid}>
            {/*File div */}
            <div className={styles.field}>
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
            </div>
            {/*Clasification div */}
            <div className={styles.field}>
              <h3>{t("header_select_clasification")}</h3>
              <p>{t("select_clasification_p_one")}</p>
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
              <input
                className={styles.originalLink}
                value={inputs.originalLink}
                onChange={(e) =>
                  setInputs({ ...inputs, originalLink: e.target.value })
                }
                type="url"
              />
            </div>
          </div>
          <br />
          <TagsInterface
            fanArtTags={fanArtTags}
            setfanArtTags={setfanArtTags}
          />
          <br />
          <div className={styles.buttonAndLoad}>
            <button onClick={uploadValidations} className={styles.buttonUpload}>
              {t("button_upload_fanart")}
            </button>
            <img
              style={{ display: loading ? "block" : "none" }}
              src="/staticImgs/generalUse/kfc-kfcyuyuko.gif"
            />
          </div>
        </div>
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef} className={styles.dragItem}>
            {file && show && (
              <>
                <header className={styles.dragHeader}>
                  <p>{t("fanart_preview_text")}</p>
                  <label onClick={() => setShow(false)}>X</label>
                </header>
                <div className={styles.resizeButtons}>
                  <button onClick={() => resizePreview("+")}>
                    <img src="/icons/add_box.svg" alt="" />
                  </button>
                  <button onClick={() => resizePreview("-")}>
                    <img src="/icons/minus_box.svg" alt="" />
                  </button>
                </div>
                <div className={styles.containerImg}>
                  <img
                    onLoad={() => {
                      PreviewLoad();
                    }}
                    ref={previewRef}
                    src={file}
                    className={styles.draggableImg}
                  ></img>
                </div>
              </>
            )}
          </div>
        </Draggable>
      </div>
      {message}
    </>
  );
}
