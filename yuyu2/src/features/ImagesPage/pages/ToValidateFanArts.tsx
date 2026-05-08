import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Profile,
  HeaderPages,
  Message,
  ReduceQuality,
  TagLabel,
  type withUserData,
  type fanArt,
  type fanArtReducedQuality,
  type returnedReducedQuality,
  type tag,
} from "@shared";
import { useTranslation } from "react-i18next";
import styles from "./css/ToValidateFanArts.module.css";

export default function ToValidateFanArts() {
  const { t } = useTranslation("images");
  const [message, setMessage] = useState<undefined | ReactNode>();
  const [fanArts, setFanArts] = useState<fanArt[]>([]);
  const [reduced, setReduced] = useState<fanArtReducedQuality[]>([]);
  const [verTags, setVerTags] = useState<tag[]>([]);
  const [unverTags, setUnverTags] = useState<tag[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //Valides current user
  useEffect(() => {
    const getProfile = async () => {
      const responseProfile = (await Profile(
        localStorage.getItem("token"),
      )) as withUserData;
      if (
        !responseProfile.success ||
        responseProfile.user_data.role !== "Admin"
      ) {
        setMessage(
          <Message
            header={t("message_header_unautorized")}
            text={t("message_text_unautorizes")}
            type="error"
            setMessage={setMessage}
            toRedirect="/"
          />,
        );
      }
    };
    getProfile();
  }, []);

  //Gets FanArts
  useEffect(() => {
    const getToValidateFanArts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/fanArt/${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = (await response.json()) as fanArt[];
      setFanArts(data);

      var reduced: fanArtReducedQuality[] = [];
      var allTags: string[] = [];
      for (const fanArt of data) {
        let rer = (await ReduceQuality(
          fanArt.src,
          800,
          800,
        )) as returnedReducedQuality;

        reduced.push({
          src: rer.reduced,
          height: rer.height,
          width: rer.width,
          index: reduced.length,
          wasReduced: rer.changed,
        });
        //If the src equals to the error image it continues to the next
        //element without add tags
        if (rer.reduced === "/staticImgs/generalUse/200px-Th07Youmu.png") {
          continue;
        }

        allTags = allTags.concat(fanArt.artists, fanArt.caracters, fanArt.tags);
      }
      var tagSet = new Set(allTags);
      setReduced(reduced);

      const queryString: String = [...tagSet]
        .map((tag) => `tags=${encodeURIComponent(tag)}`)
        .join("&");

      const responseUnVer = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/unverified_tags?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (!responseUnVer.ok) {
        setLoading(false);
        return;
      }

      type thisResponse = {
        unverified_tags: tag[] | null;
        verified_tags: tag[] | null;
      };

      const dataTags = (await responseUnVer.json()) as thisResponse;
      if (dataTags.unverified_tags && dataTags.verified_tags) {
        setUnverTags(dataTags.unverified_tags);
        setVerTags(dataTags.verified_tags);
      }
    };

    setLoading(false);
    getToValidateFanArts();
  }, [page]);

  function sendToValidate(reduced: fanArtReducedQuality) {
    const toPass = {
      reduced: reduced,
      fanArt: fanArts[reduced.index],
      pending: unverTags,
    };
    navigate("/fanArts/validatePost", { state: toPass });
  }
  return (
    <>
      {message}
      <div className={styles.toValidateFanArts}>
        <HeaderPages
          image="/staticImgs/generalUse/__saigyouji_yuyuko_touhou_drawn_by_y75zei__sample-9f89b813ebba2f314ea98108f9069cda.png"
          header={t("header_to_validate")}
        />

        <div className={styles.arrows}>
          <img
            src="/icons/arrow_back.svg"
            className={page > 1 ? styles.active : ""}
            onClick={() => {
              if (page > 1 && !loading) {
                setLoading(true);
                setPage(page - 1);
              }
            }}
            alt=""
          />
          <p>{page}</p>
          <img
            src="/icons/arrow_forward.svg"
            className={fanArts.length > 5 ? styles.active : ""}
            onClick={() => {
              if (fanArts.length > 5 && !loading) {
                setLoading(true);
                setPage(page + 1);
              }
            }}
            alt=""
          />
        </div>
        <div className={styles.fanArts}>
          {fanArts &&
            reduced
              .slice(0, 5)
              .map((fan) => (
                <img
                  key={fan.index}
                  src={fan.src}
                  width={fan.width / 3}
                  height={fan.height / 3}
                  onClick={() => sendToValidate(fan)}
                />
              ))}
        </div>
        <div className={styles.tagsContainer}>
          <h2 className={styles.headerTags}>{t("unverified_tags_label")}</h2>
          <div className={styles.unverifiedTags}>
            {unverTags.length < 1 && <p>{t("no_unverified_tags")}</p>}
            {unverTags.length >= 1 &&
              unverTags.map((tag) => (
                <TagLabel key={tag.name} tag={tag} errorTag={""} />
              ))}
          </div>
          <br />
          <h2 className={styles.headerTags}>{t("verified_tags_label")}</h2>
          <div className={styles.unverifiedTags}>
            {verTags &&
              verTags.length >= 1 &&
              verTags.map((tag) => (
                <TagLabel key={tag.name} tag={tag} errorTag={""} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
