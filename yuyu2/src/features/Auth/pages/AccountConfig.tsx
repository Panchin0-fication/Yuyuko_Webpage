import { useEffect, useState, type ReactNode } from "react";
import styles from "./css/AccountConfig.module.css";
import { LogHeader } from "@features";
import {
  ValidateSesion,
  TagsSearch,
  Message,
  TagLabel,
  Profile,
  type tag,
  type userData,
  type preferences,
  type response,
  type simpleTag,
  type withUserData,
} from "@shared";
import { useTranslation } from "react-i18next";
import Select, { type StylesConfig } from "react-select";

export default function AccountConfig() {
  const { t, i18n } = useTranslation("auth");
  const [userData, setUserData] = useState<userData | null>(null);
  const [originalPref, setOriginalPref] = useState<preferences | null>(null);
  const [showConfigs, setShowConfigs] = useState({
    language: false,
    hideTags: false,
    showExplicit: false,
  });
  const [errorTag, setErrorTag] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | undefined>("en");
  const [hideTags, setHideTags] = useState<tag[]>([]);
  const [auxTag, setAuxTag] = useState<null | simpleTag[]>(null);
  const [loading, setLoading] = useState(false);
  const [explicitBox, setExplicitBox] = useState(false);
  const [message, setMessage] = useState<ReactNode | null>(null);

  //Sets the original preferences
  useEffect(() => {
    if (!userData) return;
    setOriginalPref(userData.preferences);
    setLanguage(userData.preferences.language);
    setAuxTag(userData.preferences.hideTags);
    //Map it
    var mapedTags: tag[] = userData.preferences.hideTags.map((tag: any) => ({
      ...tag,
      status: "accepted",
    }));
    setHideTags(mapedTags);
    setExplicitBox(userData.preferences.showExplicit ?? false);
  }, [userData]);

  useEffect(() => {
    var simpleTags = hideTags;
    simpleTags.map((tag: any) => {
      delete tag["status"];
    });
    setAuxTag(simpleTags);
  }, [hideTags]);
  function removeTag(tag: tag): void {
    setHideTags(hideTags.filter((current) => current.name !== tag.name));
  }

  async function changePreferences(): Promise<void> {
    setLoading(true);
    var newPreferences = {} as preferences;
    var tagSimple: any = hideTags;
    tagSimple.map((tag: any) => {
      delete tag["status"];
    });

    newPreferences["hideTags"] = tagSimple;
    newPreferences["language"] = language as string;
    newPreferences["showExplicit"] = explicitBox;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/preferences`,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newPreferences),
      },
    );
    const res = (await response.json()) as response;
    if (res.success) {
      setMessage(
        <Message
          header={
            res.success
              ? t("message_changes_preferences")
              : t("UNEXPECTED_ERROR")
          }
          text={t(res.code)}
          type="error"
          setMessage={setMessage}
          toRedirect=""
        />,
      );
      i18n.changeLanguage(language);
    }
    setLoading(false);
  }

  interface MyOption {
    label: string;
    value: string;
  }

  const options = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" },
  ];

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
    <>
      <ValidateSesion setUserData={setUserData} />
      {message}
      <div className={styles.accountConfig}>
        <br />
        <br />
        <br />
        <div className={styles.configs}>
          <LogHeader title={t("configuration_header")}></LogHeader>
          <p className={styles.currentUser}>
            {t("current_user_label")}
            <span className={styles.username}>{userData?.userName}</span>
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

            <div
              className={`${styles.contentConfig} ${styles.languageContainer}`}
              style={{
                display: showConfigs.language ? "flex" : "none",
              }}
            >
              <p className={styles.regularParagrahp}>{t("current_language")}</p>
              <Select
                styles={customStyles}
                value={options.find((opt) => opt.value === language) || null}
                options={options}
                onChange={(value) => setLanguage(value?.value)}
              ></Select>
            </div>
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

            <div
              className={`${styles.contentConfig} ${styles.contentHideTags}`}
              style={{
                display: showConfigs.hideTags ? "flex" : "none",
              }}
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
                {hideTags.map((tag, id) => (
                  <TagLabel
                    key={tag.name || id}
                    tag={tag}
                    errorTag={errorTag}
                    removeTag={removeTag}
                  />
                ))}
              </div>
              <h2 className={styles.searchTagLabel}>{t("hide_tags_search")}</h2>
              <TagsSearch
                numberTags={10}
                addedTags={hideTags}
                setAddedTags={setHideTags}
                errorTag={errorTag}
                setErrorTag={setErrorTag}
              />
            </div>
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

            <div
              className={`${styles.contentConfig}`}
              style={{
                display: showConfigs.showExplicit ? "block" : "none",
              }}
            >
              <div className={styles.showExplicitInput}>
                <p className={styles.showExplicitP}>
                  {t("show_explicit_label")}
                </p>
                <input
                  checked={explicitBox}
                  onChange={() => setExplicitBox(!explicitBox)}
                  type="checkbox"
                />
              </div>
              <p className={styles.regularParagrahp}>
                {explicitBox
                  ? t("show_explicit_info_yes")
                  : t("show_explicit_info_no")}
              </p>
            </div>
          </section>
          <button
            className={styles.saveChanges}
            onClick={() => {
              if (
                (originalPref?.hideTags !== auxTag ||
                  originalPref?.language !== language ||
                  originalPref?.showExplicit !== explicitBox) &&
                !loading
              ) {
                changePreferences();
              }
            }}
          >
            {t("show_explicit_button")}
          </button>
        </div>
      </div>
    </>
  );
}
