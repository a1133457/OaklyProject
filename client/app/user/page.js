'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function UserPage(props) {
  return (
    <div className={styles.content}>
      <link className='btn btn-primary me-1 mb-1' href="/login"> 登入</link>
      <link className='btn btn-primary me-1 mb-1' href="/register">註冊(C)</link>
      <link className='btn btn-primary me-1 mb-1' href="/user"> 使用者列表頁(R)</link>
      <link className='btn btn-primary  me-1 mb-1' href="/user/ben">使用者的主頁(R)</link>
      <link className='btn btn-primary  me-1 mb-1' href="/user/edit"> 修改個人資料(U)</link>
    </div>
  )
}
