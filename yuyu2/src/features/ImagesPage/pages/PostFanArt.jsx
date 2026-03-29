import { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import styles from "./css/PostFanArt.module.css";
import { TagsInterface } from "@features";
import { HeaderPages, Message } from "@shared";
export default function PostFanArt() {
  const fileRef = useRef(null);
  const nodeRef = useRef(null);
  //All tags fetched
  const [tags, setTags] = useState([]);
  //Tags in the added fan art
  const [fanArtTags, setfanArtTags] = useState([]);
  const [file, setFile] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    clasification: "general",
    originalLink: "",
  });

  useEffect(() => {
    const getTags = async () => {
      const dataFetch = await fetch(`${import.meta.env.VITE_API_URL}/`);
      const data = await dataFetch.json();
      console.log(data);

      let tags = [];
      for (const tag of data) {
        tags.push({ name: tag.name, category: tag.category });
      }
      setTags(tags);
    };
    getTags();
  }, []);

  function handleMessage(text, type, header) {
    setMessage(
      <Message
        header={header}
        text={text}
        type={type}
        setMessage={setMessage}
      />,
    );
  }

  async function uploadFanart() {
    let fanArtObject = {};
    //Errors
    if (!file) {
      handleMessage("Error al publicar", "Debes de subir un archivo", "error");
      return;
    }
    if (inputs.originalLink === "") {
      handleMessage("Error al publicar", "Ingresa link de la imagen", "error");
      return;
    }
    //Checks if the link works
    try {
      new URL(inputs.originalLink);
    } catch {
      handleMessage(
        "Error al publicar",
        "El link de la imagen no es valido",
        "error",
      );
      return;
    }
    setLoading(true);

    //Upload new tags to the database
    const newTags = fanArtTags.filter((tag) => tag.status === "pending");
    console.log("LELO", newTags);

    /*
    
    */

    const uploadTags = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/newTags`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTags),
      });
      const lol = await response.json();
      console.log("Lo enviado al backend:", lol);
    };
    if (newTags.length >= 1) {
      await uploadTags();
    }

    //Upload image to cloudinary
    const upload = async () => {
      const formData = new FormData();
      formData.append("file", fileRef.current.files[0]);
      formData.append("upload_preset", "images");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload-image`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      fanArtObject["src"] = data.url;
    };
    await upload();

    var filtered = { general: [], artist: [], character: [] };

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
          },
          body: JSON.stringify(fanArtObject),
        },
      );
      const result = await response.json();
      console.log(result);
      handleMessage(
        "Fan art publicado",
        "Fan art publicado exitosamente",
        "success",
      );
    };
    await uploadFanArt();
    setLoading(false);
  }
  return (
    <>
      <div className={`${styles.all} ${message && "filterMsg"}`}>
        <HeaderPages image={"/staticImgs/generalUse/postFanArt.jpg"} />
        <br />
        <div className={styles.content}>
          <div className={styles.inputsGrid}>
            <div className={styles.field}>
              <h3>Selecciona fanArt a subir</h3>
              <p>Intenta conseguir la imagen en mayor calidad posible</p>
              <input
                onChange={() => {
                  setFile(
                    URL.createObjectURL(
                      fileRef.current.files[fileRef.current.files.length - 1],
                    ),
                  );
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
                  <p>Subir</p>
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
            <div className={styles.field}>
              <h3>Clasificasión</h3>
              <p>Dependiendo de la nudes</p>
              <select
                value={inputs.clasification}
                onChange={(e) =>
                  setInputs({ ...inputs, clasification: e.target.value })
                }
                className={`${styles.button} ${styles.buttonLoad}`}
              >
                <option>General</option>
                <option>Sensitive</option>
                <option>Cuestionable</option>
                <option>Explicit</option>
              </select>
            </div>
            <div className={styles.field}>
              <h3>Ingresa link original</h3>
              <p>El link de donde sale el fan art</p>
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
            data={tags}
            fanArtTags={fanArtTags}
            setfanArtTags={setfanArtTags}
          />

          <br />
          <div>
            {loading && <img src="staticImgs/generalUse/kfc-kfcyuyuko.gif" />}
          </div>
          <button onClick={uploadFanart} className={styles.buttonUpload}>
            Postear Fan Art
          </button>
        </div>
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef} className={styles.dragItem}>
            {file && show && (
              <>
                <header className={styles.dragHeader}>
                  <p>Vista del fan art</p>
                  <label onClick={() => setShow(false)}>X</label>
                </header>
                <div className={styles.containerImg}>
                  <img src={file} className={styles.draggableImg}></img>
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
