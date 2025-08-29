'use client'

//import { useAuth } from '@/hooks/use-auth'
//import { useState } from 'react'
import styles from './sidebar.module.css'
import Link from 'next/link'

export default function UserSidebarPage() {
  return (
      <div className={styles.sidebar}>
      <Link href="/user/edit" className={styles.user}>
        <img src="/img/ting/sb/icon-sb-user.svg" alt="usericon" />
        我的資料
      </Link>

      <Link href="#" className={styles.order}>
        <img src="/img/ting/sb/icon-sb-order.svg" alt="ordericon" />
        訂單查詢
      </Link>

      <Link href="/user/coupon" className={styles.coupon}>
        <img src="/img/ting/sb/icon-sb-coupon.svg" alt="couponicon" />
        我的優惠券
      </Link>

      <Link href="/user/favorites" className={styles.heart}>
        <img src="/img/ting/sb/icon-sb-heart.svg" alt="hearticon" />
        我的最愛
      </Link>

      <Link href="/user/bookmarks" className={styles.bookmark}>
        <img src="/img/ting/sb/icon-sb-bookmark.svg" alt="bookmarkicon" />
        收藏文章
      </Link>
      <Link href="/user/organizer" className={styles.reservation}>
        <img src="/img/ting/sb/icon-sb-reservation.svg" alt="reservationicon" />
        預約紀錄
      </Link>
    </div>
  )
}
