'use client'
// 自訂組件(全域)
import GreenBorderButton from '@/app/_components/GreenBorderButton'

export default function SuccessPage() {
  return (
    <>
      <section className="d-flex flex-column gap-xl section align-items-center mt-xxxl">
        <h2 className="t-primary01 text-center">我們收到您的諮詢囉！</h2>
        <div className="d-flex flex-column gap-lg">
          <h6 className="t-primary03 text-center">親愛的 車銀優 您好：</h6>
          <p className="t-primary03 text-center" style={{ lineHeight: '32px' }}>
            感謝您填寫諮詢表單，我們已成功收到預約申請
            <br />
            整理師將於 3 個工作天內與您聯繫，討論服務細節與報價內容 <br />
            若有任何問題，歡迎隨時聯繫客服專線： 02-3363-1212 <br />
            我們很樂意為您服務！
          </p>
        </div>
        <GreenBorderButton>查看填寫明細</GreenBorderButton>
      </section>
    </>
  )
}
