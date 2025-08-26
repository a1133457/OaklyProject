'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import UserTextInput from '@/app/_components/UserTextInput'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        console.log({ email, password })
        // TODO: 呼叫後端 API
    }

    return (
        <div className={styles.full}>
            <div className={styles.left} style={{ backgroundImage: `url('/img/註冊登入圖.png')` }} />
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
                    />

                    <UserTextInput
                        id="pw"
                        label="密碼"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className={styles.btnPrimary} type="submit">登入</button>

                    <div className={styles.links}>
                        <Link href="#">忘記密碼</Link>
                        <Link href="/auth/register">加入會員</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
