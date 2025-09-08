"use client";
import { useState, useEffect, useRef } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
//CSS
import styles from "@/styles/userCoupon/userCoupon.module.css";
// 自訂組件(全域)
import TabItem from "@/app/_components/TabItem";
// 自訂組件 (專用)
import "@/styles/btnReset/btnReset.css";
import CartCoupon from "./_components/CartCoupon";
import CanUseCoupon from "./_components/CanUseCoupon";
import UsedCoupon from "./_components/UsedCoupon";
import Link from "next/link";

export default function UserCouponPage() {
  // 控制優惠券顯示
  const [activeTab, setActiveTab] = useState("canUse");

  // 抓取使用者的優惠券資料
  const userCouponsResult = useFetch(
    "http://localhost:3005/api/user/coupons/1"
  );
  const userCoupons = userCouponsResult.data ? userCouponsResult.data.data : [];
  console.log("使用者的優惠券資料", userCoupons);

  return (
    <>
      <section>
        <div className="d-flex flex-column gap-lg section">
          <h2 className="t-primary01 text-center">我的優惠券</h2>
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-lg">
              <TabItem
                onClick={() => {
                  setActiveTab("canUse");
                }}
              >
                可使用
              </TabItem>
              <TabItem
                onClick={() => {
                  setActiveTab("used");
                }}
              >
                已使用
              </TabItem>
            </div>
            <Link href="/coupon" className={`btn ${styles.brownBtn}`}>
              查看期間限定優惠券
            </Link>
          </div>

          <div className="d-flex flex-wrap gap-lg align-items-xl-start align-items-center">
            {activeTab === "canUse" &&
              userCoupons
                .filter((coupon) => coupon.status === 0)
                .map((coupon) => (
                  <CanUseCoupon
                    key={coupon.id}
                    tag={
                      coupon.category_names &&
                      coupon.category_names.split(",").length >= 6
                        ? "全館適用"
                        : `${coupon.category_names}適用`
                    }
                    name={coupon.name}
                    smallCost={`滿 $${coupon.min_discount} 使用`}
                    date={`${coupon.get_at.split("T")[0]} – ${
                      coupon.expire_at.split("T")[0]
                    }`}
                    costCate1={coupon.discount_type === 1 ? "$ " : ""}
                    cost={
                      coupon.discount_type === 1
                        ? parseInt(coupon.discount)
                        : parseInt(coupon.discount * 100)
                    }
                    costCate2={coupon.discount_type === 1 ? "" : " 折"}
                  />
                ))}            
            {activeTab === "used" &&
              userCoupons
                .filter((coupon) => coupon.status === 1)
                .map((coupon) => (
                  <UsedCoupon
                    key={coupon.id}
                    tag={
                      coupon.category_names &&
                      coupon.category_names.split(",").length >= 6
                        ? "全館適用"
                        : `${coupon.category_names}適用`
                    }
                    name={coupon.name}
                    smallCost={`滿 $${coupon.min_discount} 使用`}
                    usedDate={`${coupon.used_at.split("T")[0]} 使用完畢
                  `}
                    costCate1={coupon.discount_type === 1 ? "$ " : ""}
                    cost={
                      coupon.discount_type === 1
                        ? parseInt(coupon.discount)
                        : parseInt(coupon.discount * 100)
                    }
                    costCate2={coupon.discount_type === 1 ? "" : " 折"}
                  />
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
