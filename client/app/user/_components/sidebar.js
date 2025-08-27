'use client'

//import { useAuth } from '@/hooks/use-auth'
//import { useState } from 'react'
import styles from './sidebar.module.css'
import Link from 'next/link'

export default function UserSidebarPage() {
  return (
    <div className={styles.sidebar}>
      <a href="/user/edit">我的資料</a>
      <a href="#">訂單查詢</a>
      <a href="#">我的優惠券</a>
      <a href="/user/favorites">我的最愛</a>
      <a href="/user/bookmarks">收藏文章</a>
      <a href="#">預約紀錄</a>
    </div>
  )
}
