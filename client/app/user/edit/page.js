'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import Login from "@/app/_components/user/login"
import Edit from '@/app/_components/user/edit'
import Link from 'next/link'


export default function UserEditPage(props) {
  const {user, isLoading} = useAuth();
  const router = useRouter();

  useEffect(()=>{
    if(!isLoading && !user){
      router.replace("/auth/login");  // 導頁
    }

  },[user, isLoading]);

  //  當 Loading / 沒有使用者 的時候，沒有畫面
  if(isLoading || !user ) return null;


  return (
    <div>
      <h1>會員修改頁</h1>
      <Edit />
      {/* {user ?  <Edit /> : <Login /> } */}
      {/* <Link className='btn btn-primary me-1 mb-1' href="/auth/login"> 登入</Link>
      <Link className='btn btn-primary me-1 mb-1' href="/register">註冊(C)</Link>
      <Link className='btn btn-primary me-1 mb-1' href="/user"> 使用者列表頁(R)</Link>
      <Link className='btn btn-primary  me-1 mb-1' href="/user/ben">使用者的主頁(R)</Link>
      <Link className='btn btn-primary  me-1 mb-1' href="/user/edit"> 修改個人資料(U)</Link> */}
    </div>
  )
}
