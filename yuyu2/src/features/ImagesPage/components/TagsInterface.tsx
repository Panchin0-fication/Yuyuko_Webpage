import { useEffect, useState, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { SmallMessage, type response, type tag, type tagWithId } from "@shared";
import styles from "./css/TagsInterface.module.css";

type props = {
  fanArtTags: tag[];
  setfanArtTags: React.Dispatch<React.SetStateAction<tag[]>>;
};
export default function TagsInterface({ fanArtTags, setfanArtTags }: props) {
  const { t } = useTranslation("images");
  const [tags, setTags] = useState<tag[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputs, setInputs] = useState<{ search: string; addTag: string }>({
    search: "",
    addTag: "",
  });
  const [addButtonState, setAddButtonState] = useState<
    "general" | "character" | "artist"
  >("general");
  const [smallMessage, setSmallMessage] = useState<ReactNode | null>(null);
  const [errorTag, setErrorTag] = useState<string | null>(null);

  const NUMBER_OF_TAGS = 20;

  async function getTags(num: number) {
    setLoading(true);
    setPage(1);
    const dataFetch = await fetch(
      `${import.meta.env.VITE_API_URL}/tags?num=${num}&search=${inputs.search}`,
    );
    const data = (await dataFetch.json()) as tagWithId[];
    let tags: tag[] = [];
    for (const tag of data) {
      tags.push({
        name: tag.name,
        category: tag.category,
        status: tag.status,
      });
    }
    setTags(tags);
    setLoading(false);
  }

  useEffect(() => {
    getTags(page);
  }, []);

  //If the search tags inputs changes waits for 2 seconds without changes to serch tags in the backend
  const timerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      //Reset timer
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        getTags(1);
      }, 2000);
    }
  }, [inputs.search]);

  function addTagFromSearch(item: tag): void {
    if (!fanArtTags.find((tag) => tag.name === item.name)) {
      setfanArtTags(
        fanArtTags.concat({
          name: item.name,
          category: item.category,
          status: item.status,
        }),
      );
    } else {
      setErrorTag(item.name);
      setTimeout(() => {
        setErrorTag(null);
      }, 1000);
    }
  }

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

  function arrow(direction: "foward" | "backward") {
    if (!tags || loading) return;
    if (direction === "foward") {
      if (tags.length >= NUMBER_OF_TAGS + 1) {
        getTags(page + 1);
        setPage(page + 1);
      }
    } else {
      if (page > 1) {
        getTags(page - 1);
        setPage(page - 1);
      }
    }
  }
  return (
    tags && (
      <div className={`${styles.tagInterface}`}>
        <div className={`${styles.actualTags} ${styles.interfaceSection}`}>
          <header onClick={() => console.log(tags)} className={styles.ttt}>
            <br />
            <h3>{t("header_interface_tags_added_tags")}</h3>
          </header>
          <section className={styles.tagsContainer}>
            {fanArtTags.map((tag, id) => (
              <div
                key={id}
                className={` ${tag.category === "general" && styles.general} ${tag.category === "character" && styles.character} ${tag.category === "artist" && styles.artist}`}
              >
                <div
                  className={`${tag.name === errorTag && styles.blinkAnimation} ${styles.label}`}
                >
                  <p>{tag.name}</p>
                  <p
                    className={`${styles.clickableLabel}`}
                    onClick={() => removeTag(tag)}
                  >
                    X
                  </p>
                </div>
              </div>
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
          <section>
            <input
              type="text"
              className={styles.input}
              value={inputs.search}
              placeholder={"All"}
              onChange={(e) => {
                setInputs({ addTag: inputs.addTag, search: e.target.value });
              }}
            />

            {tags && (
              <>
                <section className={styles.tagsContainer}>
                  {tags.slice(0, NUMBER_OF_TAGS).map((tag, index) => (
                    <div
                      className={` ${tag.name === errorTag && styles.blinkAnimation} ${tag.category === "general" && styles.general} ${tag.category === "character" && styles.character} ${tag.category === "artist" && styles.artist}`}
                      key={index}
                      onClick={() => addTagFromSearch(tag)}
                    >
                      <p
                        className={`${tag.name === errorTag && styles.blinkAnimation} ${styles.label} ${styles.clickableLabel}`}
                      >
                        {tag.name}
                      </p>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <p className={styles.emptyTags}>
                      {t("text_interface_tags_no_tags_found")}
                    </p>
                  )}
                </section>

                {tags.length >= 1 && (
                  <div className={styles.pages}>
                    <img
                      className={page > 1 ? styles.arrowActive : ""}
                      onClick={() => arrow("backward")}
                      src="/icons/arrow_back.svg"
                      alt=""
                    />
                    <h3>{page}</h3>
                    <img
                      className={
                        tags.length === NUMBER_OF_TAGS + 1
                          ? styles.arrowActive
                          : ""
                      }
                      onClick={() => arrow("foward")}
                      src="/icons/arrow_forward.svg"
                      alt=""
                    />
                  </div>
                )}
              </>
            )}
          </section>
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
    )
  );
}
