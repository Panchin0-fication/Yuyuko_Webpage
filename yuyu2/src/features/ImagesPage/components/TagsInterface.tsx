import { useEffect, useState, type ReactNode } from "react";
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

  const NUMBER_OF_TAGS = 20;

  async function getTags(num: number) {
    setLoading(true);
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
    console.log("LELO", tags);
    setTags(tags);
    setLoading(false);
  }

  useEffect(() => {
    getTags(page);
  }, []);

  function addTagFromSearch(item: tag): void {
    if (!fanArtTags.find((tag) => tag.name === item.name)) {
      setfanArtTags(
        fanArtTags.concat({
          name: item.name,
          category: item.category,
          status: item.status,
        }),
      );
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
    if (!tagList || loading) return;
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
  const tagList = tags.reduce(
    (acumulador: ReactNode[] = [], item: tag, index: number) => {
      if (!acumulador) return;
      if (item.name.includes(inputs.search) || inputs.search === "") {
        acumulador.push(
          <p
            className={`${styles.label} ${styles.clickableLabel} ${item.category === "general" && styles.general} ${item.category === "character" && styles.character} ${item.category === "artist" && styles.artist}`}
            key={index}
            onClick={() => addTagFromSearch(item)}
          >
            {item.name}
          </p>,
        );
      }
      return acumulador;
    },
    [],
  );
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
                className={`${styles.label} ${tag.category === "general" && styles.general} ${tag.category === "character" && styles.character} ${tag.category === "artist" && styles.artist}`}
              >
                <p>{tag.name}</p>
                <p
                  className={styles.clickableLabel}
                  onClick={() => removeTag(tag)}
                >
                  X
                </p>
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
                setPage(1);
              }}
            />
            {tagList && (
              <>
                <section className={styles.tagsContainer}>
                  {tagList.slice(0, NUMBER_OF_TAGS)}
                  {tagList.length === 0 && (
                    <p className={styles.emptyTags}>
                      {t("text_interface_tags_no_tags_found")}
                    </p>
                  )}
                </section>

                {tagList.length >= 1 && (
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
