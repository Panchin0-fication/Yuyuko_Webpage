import { type tag } from "@shared";
import styles from "./css/TagLabel.module.css";

type props = {
  tag: tag;
  errorTag: string | null;
  addTagFromSearch?: ((tag: tag) => void) | undefined;
  removeTag?: ((tag: tag) => void) | undefined;
};
export default function TagLabel({
  tag,
  errorTag,
  addTagFromSearch,
  removeTag,
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
        {removeTag && (
          <p
            className={`${styles.clickableLabel}`}
            onClick={() => removeTag(tag)}
          >
            X
          </p>
        )}
      </div>
    </div>
  );
}
