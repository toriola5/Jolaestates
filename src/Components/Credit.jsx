import style from "./Credit.module.css";
function Credit() {
  const Year = new Date().getFullYear();
  return (
    <div className={style.credit}>
      All rights reserved David Toriola © {Year}
    </div>
  );
}

export default Credit;
