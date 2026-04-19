import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  SmallMessage,
  TagLabel,
  TagsSearch,
  type response,
  type tag,
} from "@shared";
import styles from "./css/TagsInterface.module.css";

type props = {
  fanArtTags: tag[];
  setfanArtTags: React.Dispatch<React.SetStateAction<tag[]>>;
};
export default function TagsInterface({ fanArtTags, setfanArtTags }: props) {
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
    setfanArtTags(
      fanArtTags.concat({
        name: added,
        category: addButtonState,
        status: "pending",
      } as tag),
    );
  }

  function removeTag(tag: tag) {
    setfanArtTags(fanArtTags.filter((current) => current.name !== tag.name));
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
