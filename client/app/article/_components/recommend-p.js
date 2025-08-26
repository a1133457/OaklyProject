"use client";

import Image from "next/image";
import Link from "next/link";

export default function RecommendProduct() {
  return (
    <>
      <div className="recommend-product">
        <div className="title">推薦商品</div>
        <div className="products">
          <button className="more">查看更多</button>
          <div className="product-cards">
            <Link href="/" alt="">
              <div className="pCard">
                <Image
                  className="pCardImg"
                  src="/img/red.webp"
                  alt=""
                  width={300}
                  height={344}
                />
                <div className="card-detail">
                  <div className="detail-name">名稱</div>
                  <div className="detail-price">價錢</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
