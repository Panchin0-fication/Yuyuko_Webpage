import styles from "./css/BlockMessage.module.css";
type props = {
  type: "error" | "success" | "info";
  message: string;
};
export default function BlockMessage({ type, message }: props) {
  var icon;
  var style;
  switch (type) {
    case "error":
      icon = "/icons/error_circle.svg";
      style = styles.errorBlock;
      break;

    case "success":
      icon = "/icons/check.svg";
      style = styles.successBlock;
      break;
    default:
      break;
  }
  return (
    <div className={`${style} ${styles.blockContainer}`}>
      <img src={icon} alt="" />
      <p>{message}</p>
    </div>
  );
}
