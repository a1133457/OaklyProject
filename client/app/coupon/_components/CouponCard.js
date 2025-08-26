'use client'

import styles from '@/styles/coupon/coupon.module.css'

export default function CouponCard({ tag, date, discountNumber, smallSpend }) {
  return (
    <>
      <div
        className={`${styles.coupon} card-shadow justify-content-between d-flex flex-column`}
      >
        <div className="gap-xs d-flex flex-column align-items-center">
          <div className="d-flex flex-column align-items-center gap-xs">
            <h6 className={`text-white ${styles.couponTag}`}>{tag}</h6>
            <p className="t-primary03">{date}</p>
          </div>
          <div className="gap-xs d-flex flex-column align-items-center">
            <h4 className={`t-secondary01 ${styles.discountNumber}`}>
              {discountNumber}
              <span className={styles.discountText}> 折</span>
            </h4>
            <h6 className="t-primary03">{smallSpend}</h6>
          </div>
        </div>
        <button className={`btn t-primary01 ${styles.btnGet}`}>點擊領取</button>
      </div>
    </>
  )
}
