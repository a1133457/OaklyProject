"use client";

import "@/styles/cart/button.css";

export default function GreenButton({ step, onClick }) {
  return (
    <button onClick={onClick} className="green-button">
      <h6>{step}</h6>
    </button>
  );
}
