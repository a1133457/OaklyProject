'use client'
import Link from 'next/link'

export default function LinkArrow({ children, bookingId }) {
  const cleanId = bookingId?.replace('#', '') || bookingId;
  return (
      <Link href={`/user/organizer/${cleanId}`}
      className="readmore"
      >
        {children}
      </Link>
  )
}
