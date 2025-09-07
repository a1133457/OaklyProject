"use client";

import "@/styles/cart/button.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function GreenButton({ step, to, type }) {
  const router = useRouter();
  const { user } = useAuth();

  const goTo = () => {
    if(type === "order"){
      if(user){
        router.push(`${to}`);
      }else{
        router.push("/user/login")
      }
    }else{
      router.push(`${to}`);
    }
  }
  return (
    <button onClick={goTo} className="green-button">
      <h6>{step}</h6>
    </button>
  );
}
