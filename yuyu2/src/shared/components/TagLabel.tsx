import { type tag } from "@shared";
import styles from "./css/TagLabel.module.css";

type props = {
  tag: tag;
  errorTag: string | null;
  addTagFromSearch?: ((tag: tag) => void) | undefined;
  removeTag?: ((tag: tag) => void) | undefined;
  //For the fan art validation process
  validation?: boolean;
  verifiedTag?: ((tag: tag) => void) | undefined;
  changeShowEdit?: ((tag: tag) => void) | undefined;
};
export default function TagLabel({
  tag,
  errorTag,
  addTagFromSearch,
  removeTag,

  validation = false,
  verifiedTag,
  changeShowEdit,
}: props) {
  return (
    <div
      className={`${tag.category === "general" && styles.general} ${tag.category === "character" && styles.character} ${tag.category === "artist" && styles.artist}`}
      onClick={addTagFromSearch && (() => addTagFromSearch(tag))}
    >
      <div
        className={`${tag.name === errorTag && styles.blinkAnimation} ${styles.label}`}
      >
        <p
          className={`${tag.name === errorTag && styles.blinkAnimation}  ${styles.clickableLabel}`}
        >
          {tag.name}
        </p>
        {validation && verifiedTag && changeShowEdit && (
          <>
            <div className={styles.iconContainer}>
              <img
                onClick={() => changeShowEdit(tag)}
                className={`${styles.clickableLabel} ${styles.icon}`}
                src="/icons/edit.svg"
                alt=""
              />
            </div>

            <div className={styles.iconContainer}>
              <img
                onClick={() => verifiedTag(tag)}
                className={`${styles.clickableLabel} ${styles.icon}`}
                src="/icons/check.svg"
                alt=""
              />
            </div>
          </>
        )}
        {removeTag && (
          <div className={styles.iconContainer}>
            <img
              className={`${styles.clickableLabel} ${styles.icon}`}
              onClick={() => removeTag(tag)}
              src="/icons/close.svg"
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
}
