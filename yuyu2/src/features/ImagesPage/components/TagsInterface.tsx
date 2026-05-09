import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  SmallMessage,
  TagLabel,
  TagsSearch,
  type response,
  type tag,
  type change,
} from "@shared";
import styles from "./css/TagsInterface.module.css";

type props = {
  fanArtTags: tag[];
  setfanArtTags: React.Dispatch<React.SetStateAction<tag[]>>;
  //For the fan art validation process
  unVerTags?: tag[];
  setUnVerTags?: React.Dispatch<React.SetStateAction<tag[]>>;
  changesRecords?: change[];
  setChangesRecords?: React.Dispatch<React.SetStateAction<change[]>>;
};
export default function TagsInterface({
  fanArtTags,
  setfanArtTags,
  unVerTags,
  setUnVerTags,
  changesRecords,
  setChangesRecords,
}: props) {
  const { t } = useTranslation("images");
  const [inputs, setInputs] = useState<{ search: string; addTag: string }>({
    search: "",
    addTag: "",
  });
  const [addButtonState, setAddButtonState] = useState<
    "general" | "character" | "artist"
  >("general");
  const [smallMessage, setSmallMessage] = useState<ReactNode | null>(null);
  const [errorTag, setErrorTag] = useState<string | null>(null);

  //For validating
  const [showEdit, setShowEdit] = useState("");
  const [nameChange, setNameChange] = useState("");

  async function addTagFromNew(): Promise<void> {
    const added: string = inputs.addTag.trim().replace(" ", "_");
    // Previus validations
    if (inputs.addTag === "") {
      setSmallMessage(
        <SmallMessage
          type="error"
          message={t("small_message_error_no_tag_name")}
        />,
      );
      setTimeout(() => {
        setSmallMessage(null);
      }, 2000);
      return;
    }
    // Checks backend

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/tags/check?newTag=${inputs.addTag}`,
    );
    const res = (await response.json()) as response;
    if (!res.success) {
      setSmallMessage(
        <SmallMessage type="error" message={t("TAG_ALREADY_EXISTS")} />,
      );
      setTimeout(() => {
        setSmallMessage(null);
      }, 2000);
      return;
    }

    if (fanArtTags.find((tag) => tag.name === added)) {
      setSmallMessage(
        <SmallMessage
          type="error"
          message={t("small_message_error_already_added")}
        />,
      );
      setTimeout(() => {
        setSmallMessage(null);
      }, 2000);
      return;
    }
    //If this condition is true it means it was added by an admin
    if (unVerTags) {
      setfanArtTags(
        fanArtTags.concat({
          name: added,
          category: addButtonState,
          status: "accepted",
        } as tag),
      );
    } else {
      setfanArtTags(
        fanArtTags.concat({
          name: added,
          category: addButtonState,
          status: "pending",
        } as tag),
      );
    }
  }

  function removeTag(tag: tag) {
    setfanArtTags(fanArtTags.filter((current) => current.name !== tag.name));
    if (
      tag.status === "validating" &&
      setUnVerTags &&
      unVerTags &&
      setChangesRecords &&
      changesRecords
    ) {
      setUnVerTags(unVerTags.concat({ ...tag, status: "pending" }));
      setChangesRecords(
        changesRecords.filter((current) => current.actual !== tag.name),
      );
    }
    if (
      tag.status === "pending" &&
      setUnVerTags &&
      unVerTags &&
      setChangesRecords &&
      changesRecords
    ) {
      setUnVerTags(unVerTags.filter((current) => current.name !== tag.name));
      setChangesRecords(
        changesRecords.concat({
          type: "eliminated",
          previous: tag.name,
          actual: "Eliminated",
        }),
      );
    }
  }

  useEffect(() => {
    console.log("LOS CAMBIOS", changesRecords);
  }, [changesRecords]);

  //Validation function
  function acceptTag(tag: tag) {
    if (setUnVerTags && unVerTags && setChangesRecords && changesRecords) {
      setUnVerTags(unVerTags.filter((current) => current.name !== tag.name));
      setChangesRecords(
        changesRecords.concat({
          type: "validated",
          previous: tag.name,
          actual: tag.name,
        }),
      );
      setfanArtTags(fanArtTags.concat({ ...tag, status: "validating" }));
    }
  }

  function changeShowEdit(tag: tag) {
    showEdit === tag.name ? setShowEdit("") : setShowEdit(tag.name);
  }

  function changeTagName(tag: tag) {
    if (unVerTags && setUnVerTags && changesRecords && setChangesRecords) {
      const newName = nameChange.trim().replace(" ", "_");
      setUnVerTags((prevTags) =>
        prevTags.map((t) =>
          t.name === tag.name ? { ...t, name: newName } : t,
        ),
      );
      setChangesRecords(
        changesRecords.concat({
          type: "name",
          previous: tag.name,
          actual: newName,
        }),
      );
      setNameChange("");
    }
  }

  return (
    <div className={`${styles.tagInterface}`}>
      <div className={`${styles.actualTags} ${styles.interfaceSection}`}>
        <header className={styles.ttt}>
          <br />
          <h3>{t("header_interface_tags_added_tags")}</h3>
        </header>
        <section className={styles.tagsContainer}>
          {fanArtTags.map((tag, id) => (
            <TagLabel
              key={tag.name || id}
              tag={tag}
              errorTag={errorTag}
              removeTag={removeTag}
            />
          ))}
          {fanArtTags.length === 0 && (
            <p className={styles.emptyTags}>
              {t("text_interface_tags_add_tags")}
            </p>
          )}
        </section>
        {unVerTags && setUnVerTags && (
          <>
            <header className={styles.ttt}>
              <br />
              <h3>{t("text_interface_tags_unverified_tags")}</h3>
            </header>
            <section className={styles.tagsContainer}>
              {unVerTags.map((tag, id) => (
                <>
                  <TagLabel
                    key={tag.name || id}
                    tag={tag}
                    errorTag={errorTag}
                    removeTag={removeTag}
                    validation={true}
                    verifiedTag={acceptTag}
                    changeShowEdit={changeShowEdit}
                  />
                  {showEdit === tag.name && (
                    <div className={styles.changeContainer}>
                      <p>
                        {t("rename_objetive")} {tag.name}
                      </p>
                      <div className={styles.changeActions}>
                        <input
                          type="text"
                          value={nameChange}
                          onChange={(e) => setNameChange(e.target.value)}
                        />
                        <div className={styles.iconContainer}>
                          <img
                            src="/icons/check.svg"
                            onClick={() => changeTagName(tag)}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
              {unVerTags.length === 0 && (
                <p className={styles.emptyTags}>{t("no_tags_to_validate")}</p>
              )}
            </section>
          </>
        )}
      </div>
      <div className={`${styles.searchTags} ${styles.interfaceSection}`}>
        <header>
          <br />
          <h3>{t("header_interface_tags_search_tags")}</h3>
        </header>
        <TagsSearch
          setAddedTags={setfanArtTags}
          addedTags={fanArtTags}
          errorTag={errorTag}
          setErrorTag={setErrorTag}
          numberTags={20}
        />
      </div>
      <div className={`${styles.addTags} ${styles.interfaceSection}`}>
        <header>
          <br />
          <h3>{t("header_interface_tags_add_new_tags")}</h3>
        </header>
        <section>
          <div className={styles.buttons}>
            <button
              className={`${styles.general} ${addButtonState === "general" && styles.inactiveButton}`}
              onClick={() => setAddButtonState("general")}
            >
              <p>{t("header_interface_tags_button_category_general")}</p>
              <img src="/icons/photo.svg" alt="" />
            </button>
            <button
              className={`${styles.artist} ${addButtonState === "artist" && styles.inactiveButton}`}
              onClick={() => setAddButtonState("artist")}
            >
              <p>{t("header_interface_tags_button_category_artist")}</p>
              <img src="/icons/brush.svg" alt="" />
            </button>
            <button
              className={`${styles.character} ${addButtonState === "character" && styles.inactiveButton}`}
              onClick={() => setAddButtonState("character")}
            >
              <p>{t("header_interface_tags_button_category_character")}</p>
              <img src="/icons/person_book.svg" alt="" />
            </button>
          </div>
          <div className={styles.sectionNewTag}>
            <input
              type="text"
              className={styles.input}
              value={inputs.addTag}
              onChange={(e) =>
                setInputs({ addTag: e.target.value, search: inputs.search })
              }
            />
            <button className={styles.buttonNewTag} onClick={addTagFromNew}>
              {t("header_interface_tags_button_add_new_tag")}{" "}
              {addButtonState === "general" && "general"}{" "}
              {addButtonState === "artist" && "artista"}{" "}
              {addButtonState === "character" && "personaje"}
            </button>
            {smallMessage}
          </div>
        </section>
      </div>
    </div>
  );
}
