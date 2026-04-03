import { useState, type ReactNode } from "react";
import { SmallMessage, type tag } from "@shared";
import styles from "./css/TagsInterface.module.css";

type props = {
  data:tag[]
  fanArtTags:tag[]
  setfanArtTags:React.Dispatch<React.SetStateAction<tag[]>>
}
export default function TagsInterface({ data, fanArtTags, setfanArtTags }:props) {
  const [inputs, setInputs] = useState({ search: "", addTag: "" });
  const [addButtonState, setAddButtonState] = useState("general");
  const [page, setPage] = useState<number>(1);
  const [smallMessage, setSmallMessage] = useState<ReactNode | null>(null);

  function addTagFromSearch(item:tag):void {
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

  function addTagFromNew():void {
    const added:string = inputs.addTag.trim().replace(" ", "_");
    if (inputs.addTag === "") {
      setSmallMessage(
        <SmallMessage type="error" message="Ingresa nombre del tag" />,
      );
      setTimeout(() => {
        setSmallMessage(null);
      }, 2000);
      return;
    }
    if (data.find((addedTag) => addedTag.name === added)) {
      setSmallMessage(<SmallMessage type="error" message="Ese tag ya existe" />);
      setTimeout(() => {
        setSmallMessage(null);
      }, 2000);
      return;
    }
    if (fanArtTags.find((tag) => tag.name === added)) {
      setSmallMessage(<SmallMessage type="error" message="Ya añadiste ese tag" />);
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

  function removeTag(tag:tag) {
    setfanArtTags(fanArtTags.filter((current) => current.name !== tag.name));
  }

  function arrow(direction:"foward" | "backward") {
    if(!tagList)return;
    if (direction === "foward") {
      if (page * 15 < tagList.length) {
        setPage(page + 1);
      }
    } else {
      if (page > 1) {
        setPage(page - 1);
      }
    }
  }
  const tagList = data.reduce((acumulador:ReactNode[] = [], item:tag, index:number) => {
    if(!acumulador)return;
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
  }, []);
  return (
    data && (
      <div className={`${styles.tagInterface}`}>
        <div className={`${styles.actualTags} ${styles.interfaceSection}`}>
          <header onClick={() => console.log(data)} className={styles.ttt}>
            <br />
            <h3>Tags Añadidos</h3>
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
              <p className={styles.emptyTags}>Añade tags</p>
            )}
          </section>
        </div>
        <div className={`${styles.searchTags} ${styles.interfaceSection}`}>
          <header>
            <br />
            <h3>Buscar Tags</h3>
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
            {tagList && <>
              <section className={styles.tagsContainer}>
                {tagList.slice((page - 1) * 15, page * 15)}
                {tagList.length === 0 && (
                  <p className={styles.emptyTags}>No se encontraron tags...</p>
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
                      page * 15 < tagList.length ? styles.arrowActive : ""
                    }
                    onClick={() => arrow("foward")}
                    src="/icons/arrow_forward.svg"
                    alt=""
                  />
                </div>
            )}</>}
          </section>
        </div>
        <div className={`${styles.addTags} ${styles.interfaceSection}`}>
          <header>
            <br />
            <h3>Agregar Tags</h3>
          </header>
          <section>
            <div className={styles.buttons}>
              <button
                className={`${styles.general} ${addButtonState === "general" && styles.inactiveButton}`}
                onClick={() => setAddButtonState("general")}
              >
                <p>General</p>
                <img src="/icons/photo.svg" alt="" />
              </button>
              <button
                className={`${styles.artist} ${addButtonState === "artist" && styles.inactiveButton}`}
                onClick={() => setAddButtonState("artist")}
              >
                <p>Artista</p>
                <img src="/icons/brush.svg" alt="" />
              </button>
              <button
                className={`${styles.character} ${addButtonState === "character" && styles.inactiveButton}`}
                onClick={() => setAddButtonState("character")}
              >
                <p>Personaje</p>
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
                Añadir {addButtonState === "general" && "general"}{" "}
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
