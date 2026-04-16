import { useState, useRef } from "react";
import styles from "./css/AccountConfig.module.css";
import { LogHeader } from "@features";
import { type tag } from "@shared";
import { useTranslation } from "react-i18next";
import Select, { type StylesConfig } from "react-select";
type tagInHide = {
  name: string;
  category: "general" | "character" | "artist" | "copyright";
};

export default function AccountConfig() {
  const { t } = useTranslation("auth");
  const [showConfigs, setShowConfigs] = useState({
    language: false,
    hideTags: false,
    showExplicit: false,
  });
  const [hideTags, setHideTags] = useState<tagInHide[]>([]);
  const [fountTags, setFountTags] = useState<tag[]>([]);
  const [searchTags, setSearchTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [explicitBox, setExplicitBox] = useState(false);

  interface MyOption {
    label: string;
    value: string;
  }

  const customStyles: StylesConfig<MyOption, false> = {
    control: (provided) => ({
      ...provided,
      borderColor: "gray",
      boxShadow: "none",
      borderWidth: 2,
      borderRadius: 0,
      "&:hover": {
        borderColor: "black",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "rgb(232, 62, 169)" : "white",
      "&:hover": {
        borderColor: state.isSelected ? "rgb(232, 62, 169)" : "pink",
      },
    }),
  };
  return (
    <div className={styles.accountConfig}>
      <div className={styles.configs}>
        <LogHeader title={t("configuration_header")}></LogHeader>
        <p className={styles.currentUser}>
          {t("current_user_label")}
          <span className={styles.username}>Usuario</span>
        </p>
        {/*Language*/}
        <section className={styles.sectionConfig}>
          <header
            onClick={() =>
              setShowConfigs({
                ...showConfigs,
                language: !showConfigs.language,
              })
            }
          >
            <h2>{t("languaje_header")}</h2>
            <img
              src="/icons/arrow_down.svg"
              alt=""
              className={showConfigs.language ? styles.rotatedArrow : ""}
            />
          </header>

          {showConfigs.language && (
            <div
              className={`${styles.contentConfig} ${styles.languageContainer}`}
            >
              <p className={styles.regularParagrahp}>{t("current_language")}</p>
              <Select
                styles={customStyles}
                options={[
                  { value: "es", label: "Español" },
                  { value: "en", label: "English" },
                ]}
              ></Select>
            </div>
          )}
        </section>
        {/*Hide tags*/}
        <section className={`${styles.sectionConfig}`}>
          <header
            onClick={() =>
              setShowConfigs({
                ...showConfigs,
                hideTags: !showConfigs.hideTags,
              })
            }
          >
            <h2>{t("hide_tags_header")}</h2>
            <img
              src="/icons/arrow_down.svg"
              className={showConfigs.hideTags ? styles.rotatedArrow : ""}
              alt=""
            />
          </header>

          {showConfigs.hideTags && (
            <div
              className={`${styles.contentConfig} ${styles.contentHideTags}`}
            >
              <p className={styles.regularParagrahp}>
                {t("hide_tags_current")}
              </p>
              <div className={styles.tagsContainer}>
                {hideTags.length === 0 && (
                  <p className={styles.noFountTags}>
                    {t("hide_tags_current_empty")}
                  </p>
                )}
              </div>
              <p className={styles.regularParagrahp}>{t("hide_tags_search")}</p>
              <div className={styles.searchInput}>
                <input
                  type="text"
                  value={searchTags}
                  onChange={(e) => {
                    setSearchTags(e.target.value);
                  }}
                />
                <img
                  src="/icons/autorenew.svg"
                  style={{ visibility: loading ? "visible" : "hidden" }}
                />
              </div>

              <div className={styles.tagsContainer}>
                {fountTags.length === 0 && (
                  <p className={styles.noFountTags}>
                    {t("hide_tags_search_empty")}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
        {/*Show explicit*/}
        <section className={styles.sectionConfig}>
          <header
            onClick={() =>
              setShowConfigs({
                ...showConfigs,
                showExplicit: !showConfigs.showExplicit,
              })
            }
          >
            <h2>{t("show_explicit_header")}</h2>
            <img
              src="/icons/arrow_down.svg"
              alt=""
              className={showConfigs.showExplicit ? styles.rotatedArrow : ""}
            />
          </header>

          {showConfigs.showExplicit && (
            <div className={`${styles.contentConfig}`}>
              <div className={styles.showExplicitInput}>
                <p className={styles.showExplicitP}>
                  {t("show_explicit_label")}
                </p>
                <input
                  checked={explicitBox}
                  onClick={() => setExplicitBox(!explicitBox)}
                  type="checkbox"
                />
              </div>
              <p className={styles.regularParagrahp}>
                {explicitBox
                  ? t("show_explicit_info_yes")
                  : t("show_explicit_info_no")}
              </p>
            </div>
          )}
        </section>
        <button className={styles.saveChanges}>
          {t("show_explicit_button")}
        </button>
      </div>
    </div>
  );
}
