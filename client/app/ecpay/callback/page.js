"use client"

import React from "react";

import {useSearchParams} from "next/navigation";
import { isDev } from '@/config/client.config';
import Link from 'next/link';

export default function ECPayCallback(){
    // 取得網址參數，例如: ?RthCode=xxxxx
    const searchParams = useSearchParams();

    if(isDev) console.log("RthCode", searchParams?.get("RthCode"));

    return (
        <>
            
        </>
    )
    
}