"use client";

import "@/styles/cart/button.css";
import Link from "next/link";

export default function WhiteButton({ step, to }) {
  return (
    // <Link href="{to}" alt="">
      <button className="white-button">
        <h6>{step}</h6>
      </button>
    // </Link>
  );
}
