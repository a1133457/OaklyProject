'use client'

// 針對單一頁面使用css modules技術
import styles from '@/styles/organizer/organizer.module.css'

// 自訂組件(全域)
import GreenBorderButton from '@/app/_components/GreenBorderButton'
//自訂組件 整理師專用
import Hero from '../_components/Hero'

// 以後要串會員資料 先假資料假裝一下
const memberData = {
  name: '王小明',
  email: 'wang@example.com',
  phone: '0912345678',
}

export default function FormPage(props) {
  return (
    <>
      <Hero />
      <section>
        <div className="container-xl">
          <div
            className={`d-flex flex-column gap-xxxl section  ${styles.maxWidth960}`}
          >
            <h2 className="t-primary01 text-center">整理服務諮詢</h2>
            <form action="" method="POST" className="d-flex flex-column">
              {/* 第一個 row - 姓名 + 手機 */}
              <div className="row">
                <div className="col-12 col-md-6 mb-xl">
                  <label htmlFor="name" className="form-label t-primary03">
                    姓名*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={memberData.name}
                    readOnly
                    disabled
                    tabIndex="-1"
                  />
                </div>
                <div className="col-12 col-md-6 mb-xl">
                  <label htmlFor="phone" className="form-label t-primary03">
                    手機號碼*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={memberData.phone}
                    readOnly
                    disabled
                    tabIndex="-1"
                  />
                </div>
              </div>
              {/* 第二個 row - 信箱獨立一行 */}
              <div className="row">
                <div className="col-12 mb-xl">
                  <label htmlFor="email" className="form-label t-primary03">
                    信箱*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={memberData.email}
                    readOnly
                    disabled
                    tabIndex="-1"
                  />
                </div>
              </div>
              {/* 服務地址區塊 */}
              <div className="row">
                <div className="col-12">
                  <label className="form-label t-primary03">服務地址*</label>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <select className="form-select mb-sm" name="city" required>
                    <option value="">請選擇縣市</option>
                  </select>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <select
                    className="form-select mb-sm"
                    name="district"
                    required
                  >
                    <option value="">請選擇區域</option>
                  </select>
                </div>
                <div className="col-12 col-lg-6 mb-xl">
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="請輸入詳細地址"
                    required
                  />
                </div>
              </div>
              {/* 選整理師+日期 */}
              <div className="row">
                <div className="col-12 col-md-6 mb-xl">
                  <label className="form-label t-primary03">選擇整理師*</label>
                  <select className="form-select" name="city" required>
                    <option value="">請先選擇服務地址</option>
                  </select>
                </div>
                <div className="col-12 col-md-6 mb-xl">
                  <label className="form-label t-primary03">
                    希望服務日期*
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control"
                    value={memberData.date}
                    required
                  />
                </div>
              </div>
              {/* 上傳照片 */}
              <div className="row">
                <div className="col-12">
                  <label className="form-label t-primary03">
                    上傳整理環境照片*
                  </label>
                  <input
                    type="file"
                    name=""
                    id=""
                    accept=".png,.jpg,.jpeg"
                    multiple
                    required
                    className="d-none"
                  />
                  <div
                    className={`d-flex justify-content-center align-items-center ${styles.imgAdd}`}
                  >
                    <div className={styles.imgAddImg}></div>
                  </div>
                  <p className="t-primary03 mb-xl mt-sm">
                    可上傳 1～4 張圖片，協助我們了解您的空間狀況
                    <br />
                    支援格式：.jpg、.jpeg、.png，建議每張 ≤ 5MB
                  </p>
                </div>
              </div>
              {/* 備註 */}
              <div className="row">
                <div className="col-12">
                  <label className="form-label t-primary03">備註</label>
                  <textarea
                    name=""
                    id=""
                    rows="4"
                    placeholder="請填寫特殊需求或想告訴整理師的事項（例如：寵物、家中空間限制…）"
                    className="form-control mb-xl"
                  ></textarea>
                </div>
              </div>
              <label className="t-primary03 mb-xl text-xl-center">
                <input
                  type="checkbox"
                  name="confirm"
                  id="confirm"
                  className="form-check-input me-2 "
                />
                請確認以上資訊無誤，整理師將依據您提供的資料安排聯繫！
              </label>
              <div className="d-flex justify-content-center">
                <GreenBorderButton>提交表單</GreenBorderButton>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
