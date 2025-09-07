'use client'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'  // ✅ 新增這行
import Link from 'next/link'
import styles from '@/app/auth/auth.module.css'
import UserTextInput from '@/app/_components/UserTextInput'
import Button from '@/app/_components/Button'

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()
    const router = useRouter()  // ✅ 宣告 router

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(email, password)
            console.log("[LOGIN] success")
            router.push('/')   // ✅ 登入成功後導頁
        } catch (err) {
            console.error("[LOGIN] failed:", err)
        }
    }

    return (
        <div className={styles.full}>
            <div className={styles.left} style={{ backgroundImage: `url('/img/ting/註冊登入圖.png')` }} />
            <div className={styles.right}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <div className={styles.title}>LOGIN</div>

                    <UserTextInput
                        id="email"
                        label="電子郵件"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <UserTextInput
                        id="pw"
                        label="密碼"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />

                    <Button type="submit" variant="primary01" size="userlg">登入</Button>

                    <div className={styles.links}>
                        <Link href="#">忘記密碼</Link>
                        <Link href="/auth/register">加入會員</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
