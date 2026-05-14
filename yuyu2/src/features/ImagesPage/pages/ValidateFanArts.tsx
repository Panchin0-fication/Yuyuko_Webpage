import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TagsInterface, FieldsFanArt, PreviewImage } from "@features";
import {
  HeaderPages,
  InfoMessage,
  TagLabel,
  type fanArtReducedQuality,
  type fanArt,
  type tag,
  type change,
  type fieldsFanArtsInput,
} from "@shared";
import styles from "./css/ValidateFanArts.module.css";
export default function ValidateFanArts() {
  const { t } = useTranslation("images");
  const location = useLocation();

  const [message, setMessage] = useState<null | ReactNode>();
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

  const ALLOWED_DOMAINS = [
    "twitter.com",
    "x.com",
    "pixiv.net",
    "reddit.com",
    "deviantart.com",
    "instagram.com",
  ];

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

  useEffect(() => {
    console.log("Records: ", changesRecords);
  }, [changesRecords]);

  function getAdminTags(): ReactNode {
    //Gets all the tags added by the admin
    const addedByAdmin = changesRecords
      .filter((change) => change.type === "newAdded")
      .map((tag) => tag.actual);
    console.log("Depuracion", addedByAdmin);
    const findTags = fanArtTags
      .filter((tag) => addedByAdmin.includes(tag.name))
      .map((current) => (
        <TagLabel key={current.name} tag={current} errorTag={""} />
      ));
    return <div className={styles.tagContainer}>{findTags}</div>;
  }

  function getAddedTags(): ReactNode {
    //Gets the tags added by the TagSearch to the FanArts
    const addedTags = changesRecords
      .filter((change) => change.type === "added")
      .map((change) => change.actual);
    const findTags = fanArtTags
      .filter((tag) => addedTags.includes(tag.name))
      .map((current) => (
        <TagLabel key={current.name} tag={current} errorTag={""} />
      ));
    return <div className={styles.tagContainer}>{findTags}</div>;
  }

  function eliminatedTags() {
    //Get the eliminated validated tags from the fanArt
    const eliminatedTags: tag[] = changesRecords
      .filter((change) => change.type === "eliminated")
      .map((change) => ({
        name: change.previous,
        category: change.category,
        status: change.status,
      })) as tag[];
    const findTags = eliminatedTags.map((current) => (
      <TagLabel key={current.name} tag={current} errorTag={""} />
    ));
    return <div className={styles.tagContainer}>{findTags}</div>;
  }

  function getNewEliminatedTags() {
    const eliminatedNewTags: tag[] = changesRecords
      .filter((change) => change.type === "newEliminated")
      .map((change) => ({
        name: change.previous,
        category: change.category,
        status: change.status,
      })) as tag[];
    const findTags = eliminatedNewTags.map((current) => (
      <TagLabel key={current.name} tag={current} errorTag={""} />
    ));
    return <div className={styles.tagContainer}>{findTags}</div>;
  }

  function renamedTags(): ReactNode {
    //Gets all the renamed tags
    const previus: tag[] = changesRecords
      .filter((change) => change.type === "name")
      .map((tag) => ({
        name: tag.previous,
        category: tag.category,
        status: tag.status,
      })) as tag[];
    const actual: tag[] = changesRecords
      .filter((change) => change.type === "name")
      .map((tag) => ({
        name: tag.actual,
        category: tag.category,
        status: tag.status,
      })) as tag[];

    var toReturn: ReactNode[] = [];
    for (var i = 0; i < actual.length; i++) {
      toReturn.push(
        <div className={styles.tagContainer}>
          <TagLabel tag={previus[i]} errorTag={""} />
          <img src="/icons/arrow_forward.svg" alt="" />
          <TagLabel tag={actual[i]} errorTag={""} />
        </div>,
      );
    }
    return <div className={styles.tagContainer}>{toReturn}</div>;
  }

  function getToValidate() {
    const toValidate = changesRecords
      .filter(
        (changes) =>
          changes.type === "newAdded" || changes.type === "validated",
      )
      .map((changes) => changes.actual);
    const findTags = fanArtTags
      .filter((tag) => toValidate.includes(tag.name))
      .map((current) => (
        <TagLabel key={current.name} tag={current} errorTag={""} />
      ));
    return <div className={styles.tagContainer}>{findTags}</div>;
  }

  async function validateFanart(): Promise<void> {
    console.log("pasado a validar");
    setMessage(
      <InfoMessage
        header={"FanArt a validar"}
        onCancel={() => setMessage(null)}
        onContinue={() => setMessage(null)}
      >
        {changesRecords.length >= 1 && (
          <>
            <h2>{t("message_changes_record_h2")}</h2>
            {/*Added tags by the admin*/}
            {changesRecords.find((change) => change.type === "newAdded") && (
              <>
                <p>{t("message_new_tags_added_by_admin")}</p> {getAdminTags()}
              </>
            )}
            {/*Added tags by search tags */}
            {changesRecords.find((change) => change.type === "added") && (
              <>
                <p>{t("message_accepted_added_tags")}</p>
                {getAddedTags()}
              </>
            )}

            {changesRecords.filter((change) => change.type === "name").length >=
              1 && (
              <>
                <p>{t("message_edited_tags")}</p> {renamedTags()}
              </>
            )}
            {changesRecords.filter((change) => change.type === "eliminated")
              .length >= 1 && (
              <>
                <p>{t("message_eliminated_tags")}</p>
                {eliminatedTags()}
              </>
            )}
            {changesRecords.find(
              (change) => change.type === "newEliminated",
            ) && (
              <>
                <p>{t("message_pending_eliminated_tags")}</p>
                {getNewEliminatedTags()}
              </>
            )}
            {changesRecords.find(
              (change) =>
                change.type === "validated" || change.type === "newAdded",
            ) && (
              <>
                <p>{t("message_tags_to_validate")}</p>
                {getToValidate()}
              </>
            )}
          </>
        )}
        {changesRecords.length <= 0 && <h2>{t("message_no_changes")}</h2>}
        <h2>{t("message_to_validate")}</h2>
        <p>{t("message_validate_actions")}</p>
      </InfoMessage>,
    );
  }

  function validateButton(): void {
    // %% Validations
    if (unVerTags.length >= 1) {
      setMessage(
        <InfoMessage
          header={t("message_header_error_validating")}
          onCancel={() => setMessage(null)}
          onContinue={() => setMessage(null)}
        >
          <h2>{t("message_unverified_tags_h2")}</h2>
          <p>{t("message_validation_error_info")}</p>
          <p>{t("message_unverified_tags_p")}</p>
          <div className={styles.tagContainer}>
            {unVerTags.map((tag) => (
              <TagLabel key={tag.name} tag={tag} errorTag={""} />
            ))}
          </div>
        </InfoMessage>,
      );
      return;
    }
    if (
      fanArtTags.filter((tag) => tag.name === "saigyouji_yuyuko").length < 1
    ) {
      setMessage(
        <InfoMessage
          header={t("message_header_error_validating")}
          onCancel={() => setMessage(null)}
          onContinue={() => setMessage(null)}
        >
          <h2>{t("message_no_yuyuko_h2")}</h2>
          <p>{t("message_validation_error_info")}</p>
          <p>{t("message_no_yuyuko_p")}</p>
        </InfoMessage>,
      );
      return;
    }
    let url: URL;
    try {
      url = new URL(fields.originalLink);
    } catch {
      setMessage(
        <InfoMessage
          header={t("message_header_error_validating")}
          onCancel={() => setMessage(null)}
          onContinue={() => setMessage(null)}
        >
          <h2>{t("message_invalid_link_h2")}</h2>
          <p>{t("message_validation_error_info")}</p>
          <p>{t("message_body_error_posting_no_link")}</p>
        </InfoMessage>,
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
      setMessage(
        <InfoMessage
          header="Error al validar"
          onCancel={() => setMessage(null)}
          onContinue={() => setMessage(null)}
        >
          <h2>{t("message_invalid_site_h2")}</h2>
          <p>{t("message_validation_error_info")}</p>
          <p>{t("message_body_error_posting_unauthorized_domain")}</p>
          <p>
            {t("message_invalid_site_p")}{" "}
            {ALLOWED_DOMAINS.map((domain) => (
              <span key={domain}>{domain} </span>
            ))}
          </p>
        </InfoMessage>,
      );
      return;
    }

    // Warnings
    var continueValidation = true;
    if (fanArtTags.filter((tag) => tag.category === "artist").length < 1) {
      continueValidation = false;
      setMessage(
        <InfoMessage
          header={t("info_message_no_artist_header")}
          onCancel={() => setMessage(null)}
          onContinue={() => validateFanart()}
        >
          <h2>{t("info_message_no_artist_h2")}</h2>
          <p>{t("info_message_no_artist_p_one")}</p>
          <p>{t("info_message_no_artist_p_two")}</p>
        </InfoMessage>,
      );
    }
    if (continueValidation) validateFanart();
  }

  return (
    <div className={styles.validateFanArts}>
      <HeaderPages
        image="/staticImgs/generalUse/__saigyouji_yuyuko_touhou_drawn_by_y75zei__sample-9f89b813ebba2f314ea98108f9069cda.png"
        header={t("header_validate_fanart")}
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
      <br />
      <TagsInterface
        fanArtTags={fanArtTags}
        setfanArtTags={setFanArtTags}
        unVerTags={unVerTags}
        setUnVerTags={setUnVerTags}
        changesRecords={changesRecords}
        setChangesRecords={setChangesRecords}
      />
      <div className={styles.buttons}>
        <button
          onClick={validateButton}
          className={`${styles.validateButton} ${styles.actionButton}`}
        >
          <p>{t("validate_fan_art_button")}</p>
          <img src="/icons/check.svg" alt="" />
        </button>
        <button className={`${styles.rejectButton} ${styles.actionButton}`}>
          <p>{t("reject_fan_art_button")}</p>
          <img src="/icons/close.svg" alt="" />
        </button>
        {message}
      </div>
    </div>
  );
}
