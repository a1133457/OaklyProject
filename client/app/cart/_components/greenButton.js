"use client";

import "@/styles/cart/button.css";

export default function GreenButton({ step, to }) {
  return (
    <button onClick={() => navigate(to)} className="green-button">
      <h6>{step}</h6>
    </button>
  );
}
