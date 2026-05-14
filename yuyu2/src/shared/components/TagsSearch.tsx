import { useState, useRef, useEffect } from "react";
import { type tagWithId, type tag, TagLabel, type change } from "@shared";
import { useTranslation } from "react-i18next";
import styles from "./css/TagsSearch.module.css";

type props = {
  numberTags?: number;
  addedTags: tag[];
  setAddedTags: React.Dispatch<React.SetStateAction<tag[]>>;
  extraStyles?: string;
  errorTag: string | null;
  setErrorTag: React.Dispatch<React.SetStateAction<string | null>>;
  //For fan art validation
  changesRecords?: change[];
  setChangesRecords?: React.Dispatch<React.SetStateAction<change[]>>;
};
export default function TagsSearch({
  numberTags = 25,
  addedTags,
  setAddedTags,
  extraStyles,
  errorTag,
  setErrorTag,
  changesRecords,
  setChangesRecords,
}: props) {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<tag[]>();
  const [search, setSearch] = useState("");
  async function getTags(num: number) {
    setPage(1);
    const dataFetch = await fetch(
      `${import.meta.env.VITE_API_URL}/tags?num=${num}&numberTags=${numberTags}&search=${search}`,
    );
    const data = (await dataFetch.json()) as tag[];
    setTags(data);
    setLoading(false);
  }

  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    //Reset timer
    setLoading(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      getTags(1);
    }, 2000);
  }, [search]);

  function addTagFromSearch(item: tag): void {
    if (!addedTags.find((tag) => tag.name === item.name)) {
      setAddedTags(
        addedTags.concat({
          name: item.name,
          category: item.category,
          status: item.status,
        }),
      );
      if (changesRecords && setChangesRecords) {
        if (
          changesRecords.find(
            (record) =>
              record.type === "eliminated" && record.previous === item.name,
          )
        ) {
          setChangesRecords(
            changesRecords.filter(
              (record) =>
                record.previous !== item.name || record.type !== "eliminated",
            ),
          );
        } else {
          setChangesRecords(
            changesRecords.concat({
              type: "added",
              previous: "None",
              actual: item.name,
              category: item.category,
              status: item.status,
            }),
          );
        }
      }
    } else {
      setErrorTag(item.name);
      setTimeout(() => {
        setErrorTag(null);
      }, 1000);
    }
  }

  function arrow(direction: "foward" | "backward") {
    if (!tags || loading) return;
    if (direction === "foward") {
      if (tags.length >= numberTags) {
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
    <section className={extraStyles}>
      <div className={styles.inputField}>
        <input
          type="text"
          className={styles.input}
          value={search}
          placeholder={"All"}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <img
          src="/icons/autorenew.svg"
          style={{ visibility: loading ? "visible" : "hidden" }}
          alt=""
        />
      </div>

      {tags && (
        <>
          <section className={styles.tagsContainer}>
            {tags.slice(0, numberTags).map((tag, index) => (
              <TagLabel
                key={tag.name || index}
                tag={tag}
                errorTag={errorTag}
                addTagFromSearch={addTagFromSearch}
              />
            ))}
            {tags.length === 0 && (
              <p className={styles.emptyTags}>{t("search_tags_not_found")}</p>
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
                className={tags.length > numberTags ? styles.arrowActive : ""}
                onClick={() => arrow("foward")}
                src="/icons/arrow_forward.svg"
                alt=""
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
