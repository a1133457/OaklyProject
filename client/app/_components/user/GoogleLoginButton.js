"use client";
import { useState } from "react";
import { signInWithGooglePopup } from "@/lib/firebase";

export default function GoogleLoginButton({ onSuccess }) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        try {
            setLoading(true);
            const { idToken, user } = await signInWithGooglePopup();

            console.log("[Google] uid:", user?.uid, "idToken.len:", idToken?.length, idToken?.slice(0, 20));

            // 丟給你的後端換成你自己的 JWT
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // 若你用 httpOnly cookie 可保留；若用 localStorage 可拿掉
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Google 登入失敗");

            // data: { status, token, user }
            // 這裡沿用你原本 use-auth.js 的流程（把 token 存起來、更新全域使用者）
            if (onSuccess) onSuccess(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button onClick={handleClick} disabled={loading} className="google-btn">
            {loading ? "登入中…" : "使用 Google 登入"}
        </button>
    );
}
