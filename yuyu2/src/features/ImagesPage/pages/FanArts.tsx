import { useEffect, useState } from "react";
import { HeaderPages, ReduceQuality, type fanArt, type fanArtReducedQuality, type returnedReducedQuality } from "@shared";
import styles from "./css/FanArts.module.css";
export default function FanArts() {
  //Used in all the page
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [tags, setTags] = useState<null | {general:string[], artist:string[], caracters:string[]}>(null);
  //Used in general fan art display
  const [data, setData] = useState<fanArt[] | null>(null);
  const [reducedData, setReducedData] = useState<fanArtReducedQuality[] | null>(null);
  const [leftArrow, setLeftArrow] = useState<boolean>(false);
  const [rightArrow, setRightArrow] = useState<boolean>(false);
  //Used when displaying just one fan art
  const [unique, setUnique] = useState<null | fanArtReducedQuality>(null);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  function renderUnique(fanArt:fanArtReducedQuality):void {
    if(!data)return
    setLoading(true);
    setUnique(fanArt);

    let general:string[] = [];
    let artist:string[]  = [];
    let caracters:string[]  = [];
    
    for (const tag of data[fanArt.index].tags) {
      general.push(tag);
    }

    for (const tag of data[fanArt.index].artists) {
      artist.push(tag);
    }

    for (const tag of data[fanArt.index].caracters) {
      caracters.push(tag);
    }
    setTags({ general: general, artist: artist, caracters: caracters });
    setLoading(false);
  }

  async function render():Promise<void> {
    setLoading(true);
    setUnique(null);
    setShowOriginal(false);
   
    const tags:string[] = search.split(" ");
    const queryString:String = tags
      .map((tag) => `tags=${encodeURIComponent(tag)}`)
      .join("&");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/fanArts/tags/${page}?${queryString}`,
    );
    let data = (await response.json()) as fanArt[];

    page <= 1 ? setLeftArrow(false) : setLeftArrow(true);
    data.length === 9 ? setRightArrow(true) : setRightArrow(false);

    //SSAFSUEFNOGUN
    data.splice(8);

    setData(data);
    console.log(data);

    let reduced:fanArtReducedQuality[] = [];

    let general:string[]  = [];
    let artist:string[]  = [];
    let caracters:string[]  = [];

    for (const fanArt of data) {
      let rer = (await ReduceQuality(fanArt.src, 800, 800)) as returnedReducedQuality;
      reduced.push({
        src: rer.reduced,
        height: rer.height,
        width: rer.width,
        index: reduced.length,
        wasReduced: rer.changed,
      });

      for (const tag of fanArt.tags) {
        if (!general.includes(tag)) {
          general.push(tag);
        }
      }

      for (const tag of fanArt.artists) {
        if (!artist.includes(tag)) {
          artist.push(tag);
        }
      }

      for (const tag of fanArt.caracters) {
        if (!caracters.includes(tag)) {
          caracters.push(tag);
        }
      }
    }
    setTags({ general: general, artist: artist, caracters: caracters });
    setReducedData(reduced);

    //await fetchFanArts(page);
    setLoading(false);
  }

  function addTag(tag:string) {
    if (search === "") {
      setSearch(`${tag}`);
    } else {
      setSearch(search + " " + `${tag}`);
    }
  }

  useEffect(() => {
    render();
  }, [page]);

  return (
    reducedData && (
      <div>
        <HeaderPages
          image="staticImgs/generalUse/__saigyouji_yuyuko_touhou_drawn_by_dounaga_nuko__sample-2fd9d01a7877ab582bb7da7d425263dd.jpg"
          isInPage={true}
        />
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.leftSection}>
              <div className={styles.serach}>
                <input
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="All"
                  value={search}
                  type="text"
                />
                <button
                  onClick={async () => {
                    if (!loading) {
                      setPage(1);
                      await render();
                    }
                  }}
                >
                  <img src="icons/search.svg" alt="" />
                </button>
              </div>
              <div className={styles.tagsList}>
                <h3>Generales</h3>
                {tags && tags.general.map((tag) => (
                  <button
                    key={tag}
                    className={`${styles.generalTags} ${styles.tags}`}
                    onClick={() => {
                      addTag(tag);
                    }}
                  >
                    {tag}
                  </button>
                ))}
                <h3>Personajes</h3>
                {tags && tags.caracters.map((tag) => (
                  <button
                    key={tag}
                    className={`${styles.caractersTags} ${styles.tags}`}
                    onClick={() => {
                      addTag(tag);
                    }}
                  >
                    {tag}
                  </button>
                ))}
                <h3>Artistas</h3>
                {tags && tags.artist.map((tag) => (
                  <button
                    key={tag}
                    className={`${styles.artistsTags} ${styles.tags}`}
                    onClick={() => {
                      addTag(tag);
                    }}
                  >
                    {tag}
                  </button>
                ))}
                {tags && unique && (
                  <>
                    <h3>Link</h3>
                    <button
                      onClick={() => {
                        if(data) window.open(data[unique.index].originalLink);
                      }}
                      className={`${styles.tags} ${styles.link}`}
                    >
                      {data && data[unique.index].originalLink}
                    </button>
                  </>
                )}
              </div>
            </div>

            {loading && (
              <div className={styles.loadingGif}>
                <img src="staticImgs/generalUse/kfc-kfcyuyuko.gif" />
              </div>
            )}
            {!unique && !loading && (
              <div className={styles.fanArts}>
                {reducedData.map((fanArt) => (
                  <button
                    key={fanArt.src}
                    onClick={() => {
                      renderUnique(fanArt);
                    }}
                  >
                    <img
                      src={fanArt.src}
                      style={{
                        width: fanArt.width / 3,
                        height: fanArt.height / 3,
                      }}
                      alt=""
                    />
                  </button>
                ))}
              </div>
            )}
            {data && unique && (
              <div className={styles.uniqueFanArt}>
                {unique.wasReduced && !showOriginal && (
                  <div className={styles.showOriginal}>
                    <button
                      onClick={() => {
                        setShowOriginal(true);
                      }}
                    >
                      <p>Mostar calidad original</p>
                    </button>
                  </div>
                )}
                <img
                  src={showOriginal ? data[unique.index].src : unique.src}
                  height={unique.height}
                  width={unique.width}
                  alt=""
                />
              </div>
            )}
          </div>
          {!unique && (
            <div className={styles.pages}>
              <button
                onClick={() => {
                  if (leftArrow && !loading) {
                    setPage(page - 1);
                  }
                }}
              >
                <img
                  className={`${leftArrow ? styles.arrowActive : ""} ${styles.arrow}`}
                  src="icons/arrow_back.svg"
                  alt=""
                />
              </button>
              <p className={styles.pageNumber}>{page}</p>

              <button
                onClick={() => {
                  if (rightArrow && !loading) {
                    setPage(page + 1);
                  }
                }}
              >
                <img
                  className={`${rightArrow ? styles.arrowActive : ""} ${styles.arrow}`}
                  src="icons/arrow_forward.svg"
                  alt=""
                />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
}
