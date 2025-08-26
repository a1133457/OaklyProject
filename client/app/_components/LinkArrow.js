'use client'
import Link from 'next/link'

export default function LinkArrow({ children }) {
  return (
    <>
      <Link href="#" className="readmore">
        {children}
      </Link>
    </>
  )
}
