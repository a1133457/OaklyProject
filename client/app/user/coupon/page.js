'use client'
//CSS
import styles from '@/styles/userCoupon/userCoupon.module.css'
// 自訂組件(全域)
import TabItem from '@/app/_components/TabItem'
// 自訂組件 (專用)
import CanUseCoupon from './_components/CanUseCoupon'
import UsedCoupon from './_components/UsedCoupon'

export default function UserCouponPage() {
  return (
    <>
      <section>
        <div className="d-flex flex-column gap-lg section">
          <h2 className="t-primary01 text-center">我的優惠券</h2>
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-lg">
              <TabItem>可使用</TabItem>
              <TabItem>已使用</TabItem>
            </div>
            <div className={`btn ${styles.brownBtn}`}>查看期間限定優惠券</div>
          </div>

          <div className="d-flex flex-column gap-lg align-items-center">
            <CanUseCoupon
              tag="收納用品適用"
              name="期間限定優惠券"
              smallCost="滿 $3000 使用"
              date="2025/7/8 – 2025/7/14"
              costCate="$ "
              cost="500"
            />
            <UsedCoupon
              tag="收納用品適用"
              name="期間限定優惠券"
              smallCost="滿 $3000 使用"
              date="2025/7/8 – 2025/7/14"
              costCate="$ "
              cost="500"
            />
          </div>
        </div>
      </section>
    </>
  )
}
