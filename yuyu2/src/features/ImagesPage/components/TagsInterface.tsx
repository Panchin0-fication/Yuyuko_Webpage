import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  SmallMessage,
  TagLabel,
  TagsSearch,
  Message,
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
  const [message, setMessage] = useState<null | ReactNode>(null);
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
    if (setChangesRecords && changesRecords) {
      if (
        changesRecords.find(
          (record) =>
            record.type === "newEliminated" && record.previous === added,
        )
      ) {
        console.log("SCOOBY DOO");
        setChangesRecords(
          changesRecords.filter(
            (record) =>
              record.previous !== added || record.type !== "newEliminated",
          ),
        );
      } else {
        setChangesRecords(
          changesRecords.concat({
            type: "newAdded",
            previous: "None",
            actual: added,
            category: addButtonState,
            status: "validating",
          }),
        );
      }
      setfanArtTags(
        fanArtTags.concat({
          name: added,
          category: addButtonState,
          status: "adminAdded",
        } as tag),
      );
    } else {
      //Added by user
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
    //Removes tag
    setfanArtTags(fanArtTags.filter((current) => current.name !== tag.name));
    //(Validation) if was validated but later rejected
    if (setUnVerTags && unVerTags && setChangesRecords && changesRecords) {
      if (tag.status === "validating") {
        //Pass to pendings and adds records
        setUnVerTags(unVerTags.concat({ ...tag, status: "pending" }));
        setChangesRecords(
          changesRecords.filter((current) => current.actual !== tag.name),
        );
      } else if (
        changesRecords.find(
          (record) => record.type === "newAdded" && record.actual === tag.name,
        )
      ) {
        setChangesRecords(
          changesRecords.filter(
            (record) =>
              record.type !== "newAdded" || record.actual !== tag.name,
          ),
        );
      } else if (tag.status === "pending") {
        setUnVerTags(unVerTags.filter((current) => current.name !== tag.name));
        setChangesRecords(
          changesRecords.concat({
            type: "newEliminated",
            previous: tag.name,
            actual: "Eliminated",
            category: tag.category,
            status: "rejected",
          }),
        );
      } else if (tag.status === "accepted") {
        if (
          changesRecords.find(
            (record) => record.type === "added" && record.actual === tag.name,
          )
        ) {
          setChangesRecords(
            changesRecords.filter(
              (record) => record.type !== "added" || record.actual !== tag.name,
            ),
          );
        } else {
          setChangesRecords(
            changesRecords.concat({
              type: "eliminated",
              previous: tag.name,
              actual: "Eliminated",
              category: tag.category,
              status: "rejected",
            }),
          );
        }
      }
    }
  }

  //Validation function
  function acceptTag(tag: tag) {
    if (setUnVerTags && unVerTags && setChangesRecords && changesRecords) {
      setUnVerTags(unVerTags.filter((current) => current.name !== tag.name));
      setChangesRecords(
        changesRecords.concat({
          type: "validated",
          previous: tag.name,
          actual: tag.name,
          category: tag.category,
          status: tag.status,
        }),
      );
      setfanArtTags(fanArtTags.concat({ ...tag, status: "validating" }));
    }
  }

  function changeShowEdit(tag: tag) {
    showEdit === tag.name ? setShowEdit("") : setShowEdit(tag.name);
  }

  async function changeTagName(tag: tag) {
    //Checks if a tag whith that name alrady exist /tags/check
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/tags/check?newTag=${nameChange.trim().replace(" ", "_")}`,
    );
    const res = (await response.json()) as response;
    if (!res.success) {
      setMessage(
        <Message
          header={"Error"}
          text={t("TAG_ALREADY_EXISTS")}
          type="error"
          setMessage={setMessage}
          toRedirect=""
        />,
      );
      return;
    }
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
          category: tag.category,
          status: tag.status,
        }),
      );
      setNameChange("");
    }
  }

  return (
    <>
      {message}
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
                  <div className={styles.editableTag}>
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
                  </div>
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
            changesRecords={changesRecords}
            setChangesRecords={setChangesRecords}
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
                {addButtonState === "general" && t("button_add_tag_general")}
                {addButtonState === "artist" && t("button_add_tag_artist")}
                {addButtonState === "character" &&
                  t("button_add_tag_character")}
              </button>
              {smallMessage}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
