'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import UserTextInput from '@/app/_components/UserTextInput'
import Button from '@/app/auth/_components/Button'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const [pw2, setPw2] = useState('')
    const [error, setError] = useState(null)

    const onSubmit = (e) => {
        e.preventDefault()
        if (pw !== pw2) {
            setError('兩次密碼不一致')
            return
        }
        setError(null)
        console.log({ name, email, pw })
        // TODO: 呼叫後端 API
    }

    return (
        <div className={styles.full}>
            <div className={styles.left} style={{ backgroundImage: `url('/img/註冊登入圖.png')` }} />
            <div className={styles.right}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <div className={styles.title}>REGISTER</div>

                    <UserTextInput className="rounded-0" id="name" label="使用者名稱"
                        value={name} onChange={(e) => setName(e.target.value)} required />

                    <UserTextInput id="email" label="電子郵件" type="email"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <UserTextInput id="pw" label="密碼" type="password"
                        value={pw} onChange={(e) => setPw(e.target.value)} required />

                    <UserTextInput id="pw2" label="確認密碼" type="password"
                        value={pw2} onChange={(e) => setPw2(e.target.value)}
                        error={error} required />

                    {/* <button className={styles.btnPrimary} type="submit">註冊</button> */}
                    <Button type="submit" variant="primary01" size="lg">註冊</Button>

                    <div className="mt-3" style={{ color: '#919191' }}>
                        已經有帳號了？<Link href="/auth/login" style={{ color: '#5b887b' }}>登入會員</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
