import LinkArrow from '@/app/_components/LinkArrow'
import styles from '@/styles/userOrganizerDetails/userOrganizerDetails.module.css'
import Image from 'next/image'

export default function ListDetails({ status = 1 }) {
  const statusConfig = {
    1: {
      label: '諮詢中',
      description: '我們已收到您的需求，整理師將儘快與您聯繫',
      bottomText: '',
      action: '編輯諮詢',
    },
    2: {
      label: '已預約',
      description:
        '已為您安排預約時段，請留意簡訊與通知，我們將於約定時間提供服務',
      bottomText: '無法取消',
      action: '',
    },
    3: {
      label: '已完成',
      description: '感謝您的信任與配合，此次整理服務已順利完成！',
      bottomText: '服務已完成',
      action: '',
    },
    4: {
      label: '已取消',
      description: '此筆預約已取消。如有其他需求，歡迎隨時重新預約或聯繫我們',
      bottomText: '',
      action: '重新預約',
    },
  }

  const currentStatus = statusConfig[status]

  return (
    <>
      <div
        className={`d-flex gap-lg flex-column ${styles.listCard} ${styles[`listCardStatus${status}`]}`}
      >
        <div className="d-flex flex-column gap-md">
          <h6 className={`text-white ${styles[`listStatus${status}`]}`}>
            {currentStatus.label}
          </h6>
          {/* info */}
          <div className={`d-flex flex-column flex-md-row ${styles.infoGap}`}>
            <div className="d-flex flex-column gap-sm flex-md-fill">
              <p className="t-primary03">服務整理師：柳柏丞</p>
              <p className="t-primary03">希望服務日期：2025/07/23</p>
              <p className="t-primary03">
                服務地址：台北市文山區新光路二段30號
              </p>
            </div>
            <div
              className={`d-flex flex-column gap-sm ${styles.minWidth} flex-md-fill`}
            >
              <p className="t-primary03">預約編號：#000001</p>
              <p className="t-primary03">建立時間：2025/06/20</p>
            </div>
          </div>
          <div className={`d-flex flex-column gap-md ${styles.ptMd}`}>
            {/* userInfo */}
            <div className="d-flex flex-column gap-sm flex-md-fill">
              <p className="t-primary03">預約人資訊：</p>
              <p className="t-primary03">姓名：陳小姐</p>
              <p className="t-primary03">電話：0912-345-678</p>
              <p className="t-primary03">Email：example@email.com</p>
            </div>
            {/* img */}
            <div className="d-flex flex-column gap-xs flex-md-fill">
              <p className="t-primary03">環境照片：</p>
              <div
                className={`d-flex align-items-center flex-wrap ${styles.imgGap}`}
              >
                <Image
                  src="/img/hui/defaultimg.png"
                  width={150}
                  height={150}
                  alt="使用者環境照片"
                  className={styles.userHouseImage}
                />
                <Image
                  src="/img/hui/defaultimg.png"
                  width={150}
                  height={150}
                  alt="使用者環境照片"
                  className={styles.userHouseImage}
                />
                <Image
                  src="/img/hui/defaultimg.png"
                  width={150}
                  height={150}
                  alt="使用者環境照片"
                  className={styles.userHouseImage}
                />
              </div>
            </div>
            {/* note */}
            <div className="d-flex flex-column gap-xs">
              <p className="t-primary03">備註：</p>
              <p className="t-primary03">
                希望整理客廳與收納櫃。
                家中有兩隻活潑貓咪，容易掉毛，建議整理師穿著防毛材質的服裝，避免毛髮沾黏。
                <br />
                居住空間內有大量收納櫃與儲物區，整體物品數量較多，可能需要增加人手或延長作業時間。
                <br />
                請整理師攜帶適合清潔貓毛的工具（如黏毛滾、除毛刷等）以備不時之需。
              </p>
            </div>
          </div>
        </div>
        <div className={`d-flex justify-content-between ${styles.cardBottom}`}>
          <h5 className="t-primary03">完成諮詢報價後顯示</h5>
          {currentStatus.bottomText && (
            <h6 className="t-primary02">{currentStatus.bottomText}</h6>
          )}
          {currentStatus.action && (
            <LinkArrow>{currentStatus.action}</LinkArrow>
          )}
        </div>
      </div>
      <h6 className="t-gray600 text-center">{currentStatus.description}</h6>
    </>
  )
}
