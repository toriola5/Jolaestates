import styles from "./MessageAlert.module.css";
function MessageAlert({ type, message }) {
  return (
    <div
      className={
        (type == "error" && styles.error) ||
        (type === "info" && styles.info) ||
        (type == "success" && styles.success)
      }
    >
      {message}
    </div>
  );
}

export default MessageAlert;
