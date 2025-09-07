'use client'

import { useState, useEffect } from 'react'

import Login from "@/app/_components/user/login"
import Edit from '@/app/_components/user/edit'

import { useAuth } from '@/hooks/use-auth'


export default function UserEditPage(props) {
  const {user} = useAuth();
  return (
    <div>
      <h1>會員修改頁</h1>
      
      {user ?  <Edit /> : <Login /> }
      {/* <Link className='btn btn-primary me-1 mb-1' href="@/app/auth/login"> 登入</Link>
      <Link className='btn btn-primary me-1 mb-1' href="/register">註冊(C)</Link>
      <Link className='btn btn-primary me-1 mb-1' href="/user"> 使用者列表頁(R)</Link>
      <Link className='btn btn-primary  me-1 mb-1' href="/user/ben">使用者的主頁(R)</Link>
      <Link className='btn btn-primary  me-1 mb-1' href="/user/edit"> 修改個人資料(U)</Link> */}
    </div>
  )
}
