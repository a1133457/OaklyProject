'use client'

//import { useAuth } from '@/hooks/use-auth'
//import { useState } from 'react'
import styles from './sidebar.module.css'
import Link from 'next/link'

export default function UserSidebarPage() {
  return (
      <div className={styles.sidebar}>
      <Link href="/user/edit" className={styles.user}>
        <i className="fas fa-user"></i>
        我的資料
      </Link>

      <Link href="#" className={styles.order}>
        <i className="fas fa-list-alt"></i>
        訂單查詢
      </Link>

      <Link href="/user/coupon" className={styles.coupon}>
        <i className="fas fa-ticket-alt"></i>
        我的優惠券
      </Link>

      <Link href="/user/favorites" className={styles.heart}>
        <i className="fas fa-heart"></i>
        我的最愛
      </Link>

      <Link href="/user/bookmarks" className={styles.bookmark}>
        <i className="fas fa-bookmark"></i>
        收藏文章
      </Link>
      <Link href="/user/organizer" className={styles.reservation}>
        <i className="fas fa-calendar-alt"></i>
        預約紀錄
      </Link>
    </div>
  )
}
