'use client'

// 針對單一頁面使用css modules技術
import styles from '@/styles/index/index.module.css'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 靜態圖片
import spaceImage from '@/public/img/hui/space/high-angle-desk-arrangement.jpg'
import organizerImage from '@/public/img/hui/space/ai-generated-modern-styled-entryway-crop.jpg'
import organizerImageLg from '@/public/img/hui/space/ai-generated-modern-styled-entryway.jpg'
// 自訂組件(全域)
import GreenBorderButton from '@/app/_components/GreenBorderButton'
import TabItem from '@/app/_components/TabItem'
// 自訂組件(首頁)
import ProductCard from './_components/index/ProductCard'
import ArticleCard from './_components/index/ArticleCard'
import CarouselHead from './_components/index/CarouselHead'

export default function IndexPage(props) {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - e.currentTarget.offsetLeft)
    setScrollLeft(e.currentTarget.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - e.currentTarget.offsetLeft
    const walk = (x - startX) * 1 // 滑動速度倍數
    e.currentTarget.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <>
      <section>
        <CarouselHead />
      </section>
      {/* section-01: 挑選空間 */}
      <section>
        <div className="container-xl">
          <div className="d-flex flex-column justify-content-center align-items-center section gap-xxxl">
            <div className="row">
              <div className="gap-md d-flex text-center flex-column align-items-center">
                <h2 className="t-primary01">挑選你的空間</h2>
                <h5 className="t-gray600">每個空間，都是生活的一種樣子</h5>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className={`${styles.cateIcons}`}>
                <Link
                  href="/livingroom"
                  className={`${styles.cate} d-flex justify-content-center align-items-center flex-column`}
                >
                  <div className={`${styles.cateIcon} ${styles.livingroom}`} />
                  <h6>客 廳</h6>
                </Link>
                <a
                  href="#"
                  className={`${styles.cate} d-flex justify-content-center align-items-center flex-column`}
                >
                  <div className={`${styles.cateIcon} ${styles.kitchen}`} />
                  <h6>餐廚空間</h6>
                </a>
                <a
                  href="#"
                  className={`${styles.cate} d-flex justify-content-center align-items-center flex-column`}
                >
                  <div className={`${styles.cateIcon} ${styles.bedroom}`} />
                  <h6>臥 室</h6>
                </a>
                <a
                  href="#"
                  className={`${styles.cate} d-flex justify-content-center align-items-center flex-column`}
                >
                  <div className={`${styles.cateIcon} ${styles.kidroom}`} />
                  <h6>兒童房</h6>
                </a>
                <a
                  href="#"
                  className={`${styles.cate} d-flex justify-content-center align-items-center flex-column`}
                >
                  <div className={`${styles.cateIcon} ${styles.office}`} />
                  <h6>辦公空間</h6>
                </a>
                <a
                  href="#"
                  className={`${styles.cate} d-flex justify-content-center align-items-center flex-column`}
                >
                  <div className={`${styles.cateIcon} ${styles.storage}`} />
                  <h6>收納用品</h6>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section-02: 精選生活提案 */}
      <section>
        <div className="container-xl">
          <div className="d-flex flex-column align-items-center section gap-xl">
            <h2 className="t-primary01 text-center">精選生活提案</h2>

            <div className="row w-100">
              <div className="col-12 d-flex flex-column flex-lg-row justify-content-lg-between align-items-center">
                <div className="d-flex gap-lg align-items-center">
                  <TabItem>為你推薦</TabItem>
                  <TabItem>新品專區</TabItem>
                  <TabItem>熱銷商品</TabItem>
                </div>
                <div
                  className={`d-flex gap-md ${styles.arrow} d-none d-lg-flex`}
                >
                  <button className={`btn d-flex ${styles.arrowLeft}`} />
                  <button className={`btn d-flex ${styles.arrowRight}`} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div
                  className={`d-flex flex-wrap justify-content-center ${styles.productGap}`}
                >
                  <ProductCard
                    img="/img/hui/product/0583377_PE671187_S5.jpg"
                    name="電視櫃"
                    price="8,999"
                  />
                  <ProductCard
                    img="/img/hui/product/0583377_PE671187_S5.jpg"
                    name="電視櫃"
                    price="8,999"
                  />
                  <ProductCard
                    img="/img/hui/product/0583377_PE671187_S5.jpg"
                    name="電視櫃"
                    price="8,999"
                  />
                  <ProductCard
                    img="/img/hui/product/0583377_PE671187_S5.jpg"
                    name="電視櫃"
                    price="8,999"
                  />
                  <ProductCard
                    img="/img/hui/product/0583377_PE671187_S5.jpg"
                    name="電視櫃"
                    price="8,999"
                  />
                  <ProductCard
                    img="/img/hui/product/0583377_PE671187_S5.jpg"
                    name="電視櫃"
                    price="8,999"
                  />
                  <div className="d-none d-lg-block">
                    <ProductCard
                      img="/img/hui/product/0583377_PE671187_S5.jpg"
                      name="電視櫃"
                      price="8,999"
                    />
                  </div>
                  <div className="d-none d-lg-block">
                    <ProductCard
                      img="/img/hui/product/0583377_PE671187_S5.jpg"
                      name="電視櫃"
                      price="8,999"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row align-items-center d-lg-none">
              <div className="col-12">
                <div
                  className={`d-flex gap-xl justify-content-center ${styles.arrow}`}
                >
                  <button className={`btn d-flex ${styles.arrowLeft}`} />
                  <button className={`btn d-flex ${styles.arrowRight}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section-03: 為你準備的小確幸 */}
      <section>
        <div className="container-xl">
          <div className="d-flex flex-column section gap-xxxl">
            <h2 className="t-primary01 text-center">為你準備的小確幸</h2>

            <div
              className={`d-flex flex-column flex-lg-row align-items-center justify-content-center gap-xxxl w-100 ${styles.section03Gap}`}
            >
              <div className="w-100 w-lg-50 d-flex justify-content-center">
                <Image
                  src={spaceImage}
                  alt="居家辦公空間"
                  className={`${styles.section03Img}`}
                />
              </div>

              <div
                className={`d-flex gap-xl flex-column flex-lg-align-items-start text-center text-lg-start w-100 w-lg-50 ${styles.py28}`}
              >
                <div className="d-flex flex-column gap-md">
                  <h4 className="t-secondary01">
                    打造你的居家辦公角落
                    <br />
                    本週領券享 88 折起
                  </h4>
                  <h5 className={`t-primary03 ${styles.leftLine}`}>
                    不論是追劇還是遠端會議，一張順眼又順手的桌椅能讓空間更好用。
                  </h5>
                  <p className="t-primary03">
                    7/8–7/14 期間
                    <br />
                    領券可享指定商品 88 折或滿 $3000 折 $400
                  </p>
                </div>
                <div className="d-flex justify-content-center justify-content-lg-start">
                  <GreenBorderButton>前往優惠專區</GreenBorderButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section-04: 整理師區塊 */}
      <section>
        <div className="section-fluid">
          <div className={styles.section04Content}>
            <div className="d-flex flex-column flex-lg-row justify-content-lg-center align-items-center gap-xl">
              <div
                className={`d-flex flex-column align-items-center align-items-lg-start ${styles.gap32}`}
              >
                <div className="d-flex flex-column gap-md text-center text-lg-start">
                  <h2 className="t-secondary01">
                    一點一滴收好
                    <br />
                    是為了更輕鬆的生活
                  </h2>
                  <h5 className={`t-primary03 ${styles.leftLine}`}>
                    當你不知道從哪裡開始整理，我們會陪你一起慢慢來
                  </h5>
                </div>
                <div className="d-flex flex-column align-items-lg-start align-items-center text-center gap-md">
                  <div className="d-flex gap-md text-center text-lg-start">
                    <div className={styles.icon1}></div>
                    <div className="flex-1">
                      <h6 className="t-primary01">空間調整建議</h6>
                      <p className="t-primary03">
                        根據家中動線與使用頻率規劃收納方式
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-md text-center text-lg-start">
                    <div className={styles.icon2}></div>
                    <div className="flex-1">
                      <h6 className="t-primary01">提升使用效率</h6>
                      <p className="t-primary03">讓常用的東西更順手、更好找</p>
                    </div>
                  </div>
                  <div className="d-flex gap-md text-center text-lg-start">
                    <div className={styles.icon3}></div>
                    <div className="flex-1">
                      <h6 className="t-primary01">建立日常好習慣</h6>
                      <p className="t-primary03">設計簡單可維持的使用邏輯</p>
                    </div>
                  </div>
                </div>
                <GreenBorderButton>認識空間整理師</GreenBorderButton>
              </div>

              <Image
                src={organizerImage}
                alt="整理師圖片"
                className={styles.section04Img}
              />
              <Image
                src={organizerImageLg}
                alt="整理師圖片"
                className={styles.section04ImgLg}
              />
            </div>
          </div>
        </div>
      </section>
      {/* section-05: 編輯推薦文章 */}
      <section>
        <div className="section-fluid d-flex flex-column gap-xxxl align-items-center">
          <div className="gap-md text-center d-flex flex-column">
            <h2 className="t-primary01">編輯推薦文章</h2>
            <h5 className="t-gray600">想了解更多整理技巧？這些文章值得一讀</h5>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions */}
          <div
            className={`${styles.articleArea} d-flex`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <ArticleCard
              tag="#餐廳空間 #生活節奏"
              img="/img/hui/space/pexels-pixabay-358572.jpg"
              title="餐桌就是生活緩衝區"
              content="每天吃飯的地方，最容易被堆滿雜物。這篇文章分享怎麼讓餐桌回到「生活中心」的角色，不只是清空，更是整理節奏的開始。"
              date="2025 / 7 / 2"
            />{' '}
            <ArticleCard
              tag="#餐廳空間 #生活節奏"
              img="/img/hui/space/pexels-pixabay-358572.jpg"
              title="餐桌就是生活緩衝區"
              content="每天吃飯的地方，最容易被堆滿雜物。這篇文章分享怎麼讓餐桌回到「生活中心」的角色，不只是清空，更是整理節奏的開始。"
              date="2025 / 7 / 2"
            />{' '}
            <ArticleCard
              tag="#餐廳空間 #生活節奏"
              img="/img/hui/space/pexels-pixabay-358572.jpg"
              title="餐桌就是生活緩衝區"
              content="每天吃飯的地方，最容易被堆滿雜物。這篇文章分享怎麼讓餐桌回到「生活中心」的角色，不只是清空，更是整理節奏的開始。"
              date="2025 / 7 / 2"
            />{' '}
            <ArticleCard
              tag="#餐廳空間 #生活節奏"
              img="/img/hui/space/pexels-pixabay-358572.jpg"
              title="餐桌就是生活緩衝區"
              content="每天吃飯的地方，最容易被堆滿雜物。這篇文章分享怎麼讓餐桌回到「生活中心」的角色，不只是清空，更是整理節奏的開始。"
              date="2025 / 7 / 2"
            />{' '}
            <ArticleCard
              tag="#餐廳空間 #生活節奏"
              img="/img/hui/space/pexels-pixabay-358572.jpg"
              title="餐桌就是生活緩衝區"
              content="每天吃飯的地方，最容易被堆滿雜物。這篇文章分享怎麼讓餐桌回到「生活中心」的角色，不只是清空，更是整理節奏的開始。"
              date="2025 / 7 / 2"
            />{' '}
            <ArticleCard
              tag="#餐廳空間 #生活節奏"
              img="/img/hui/space/pexels-pixabay-358572.jpg"
              title="餐桌就是生活緩衝區"
              content="每天吃飯的地方，最容易被堆滿雜物。這篇文章分享怎麼讓餐桌回到「生活中心」的角色，不只是清空，更是整理節奏的開始。"
              date="2025 / 7 / 2"
            />{' '}
            <ArticleCard
              tag="#餐廳空間 #生活節奏"
              img="/img/hui/space/pexels-pixabay-358572.jpg"
              title="餐桌就是生活緩衝區"
              content="每天吃飯的地方，最容易被堆滿雜物。這篇文章分享怎麼讓餐桌回到「生活中心」的角色，不只是清空，更是整理節奏的開始。"
              date="2025 / 7 / 2"
            />
          </div>
          <GreenBorderButton>想看更多文章</GreenBorderButton>
        </div>
      </section>
    </>
  )
}
