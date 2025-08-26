"use client";

import "@/styles/cart/button.css";
import { Link, useNavigate } from "react-router-dom";

export default function WhiteButton({ step, to }) {
  const navigate = useNavigate();
  return (
    <Link href="{to}">
      <button className="white-button">
        <h6>{step}</h6>
      </button>
    </Link>
  );
}
