import styles from "@/styles/userOrganizer/userOrganizer.module.css";

export default function ItemTab() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center flex-wrap gap-md">
        <button className={`btn ${styles.itemBtn}`}>
          <span className={styles.bold}>1.諮詢中</span>
          <br />
          待整理師聯繫報價
        </button>
        <div className={styles.dash}></div>
        <button className={`btn ${styles.itemBtn}`}>
          <span className={styles.bold}>2.預約成功</span>
          <br />
          請等待服務當日
        </button>
        <div className={styles.dash}></div>
        <button className={`btn ${styles.itemBtn}`}>
          <span className={styles.bold}>3.服務完成</span>
          <br />
          隨時歡迎再次預約
        </button>
        <div className={styles.dash}></div>
        <button className={`btn ${styles.itemBtn}`}>
          <span className={styles.bold}>已取消</span>
          <br />
          此次諮詢未成立
        </button>
      </div>
    </>
  );
}
