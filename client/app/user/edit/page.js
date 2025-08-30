'use client'

import { useState } from 'react'
import Sidebar from '../_components/sidebar'
import HeaderImg from '../_components/HeaderImg'
import styles from '../user.module.css'

// 共用元件
import UserTextInput from '@/app/_components/UserTextInput'
import UserSelect from '@/app/_components/UserSelect'
import UserFormRow from '@/app/_components/UserFormRow'
import Button from '@/app/_components/Button'
import ButtonGroup from '@/app/_components/ButtonGroup'

export default function UserEditForm() {
    const [name, setName] = useState('')
    const [birthday, setBirthday] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [addr, setAddr] = useState('')
    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const [pw2, setPw2] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [errors, setErrors] = useState({})

    const cities = [{ value: '臺北市', label: '臺北市' }, { value: '新北市', label: '新北市' }]
    const districts = city === '臺北市'
        ? ['中正區', '大安區', '信義區'].map(v => ({ value: v, label: v }))
        : city === '新北市'
            ? ['板橋區', '新莊區', '中和區'].map(v => ({ value: v, label: v }))
            : []

    const handleSubmit = (e) => {
        e.preventDefault()
        const next = {}
        if (pw && pw !== pw2) next.pw2 = '兩次密碼不一致'
        setErrors(next)
        if (Object.keys(next).length) return
        // TODO: 串 API
    }

    const handleReset = () => {
        setName(''); setBirthday(''); setPhone('');
        setCity(''); setDistrict(''); setAddr('');
        setEmail(''); setPw(''); setPw2('');
        setAvatar(null); setErrors({})
    }

    return (
        <div>
            {/* layout 區 */}
            <HeaderImg title="MY ACCOUNT" />
            <div className={`container-fluid ${styles.userContainer}`}>
                <div className={styles.layout}>
                    <div className={styles.sidebarWrapper}>
                        <Sidebar />
                    </div>

                    <div className={styles.content}>
                        {/* 大頭貼上傳 */}
                        <div className={`${styles.avatarUpload} ${styles.uploader}`}>
                            <label htmlFor="avatarInput">
                                <img src={avatar ? URL.createObjectURL(avatar) : '/img/ting/pexels-anntarazevich-8152002.jpg'}
                                    alt="頭像預覽" className={styles.avatarImg} />
                            </label>
                            <input id="avatarInput" type="file" accept="image/*"
                                onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} />
                        </div>

                        <form onSubmit={handleSubmit} onReset={handleReset} className="g-5">
                            <UserTextInput id="name" label="姓名" required
                                value={name} onChange={e => setName(e.target.value)} />

                            <UserTextInput id="birth" label="生日" type="date" required
                                value={birthday} onChange={e => setBirthday(e.target.value)} />

                            <UserTextInput id="phone" label="電話" type="tel" required
                                value={phone} onChange={e => setPhone(e.target.value)} />

                            <UserFormRow
                                left={
                                    <UserSelect id="city" label="縣市" required
                                        value={city} onChange={e => { setCity(e.target.value); setDistrict('') }}
                                        options={cities} placeholder="選擇縣市" />
                                }
                                // TODO: 依 city 篩選 
                                right={
                                    <UserSelect id="district" label="地區" required
                                        value={district} onChange={e => setDistrict(e.target.value)}
                                        options={districts} placeholder="選擇地區" />
                                }
                            />


                            <UserTextInput id="addr" label="地址" required
                                value={addr} onChange={e => setAddr(e.target.value)} />

                            <UserTextInput id="email" label="電子郵件" type="email" required
                                value={email} onChange={e => setEmail(e.target.value)} />

                            <UserTextInput id="pw" label="新密碼" type="password"
                                value={pw} onChange={e => setPw(e.target.value)} />

                            <UserTextInput id="pw2" label="確認新密碼" type="password"
                                value={pw2} onChange={e => setPw2(e.target.value)} error={errors.pw2} />

                            {/* <div className="d-flex justify-content-center gap-2 mt-3 formButtons">
                                <button type="submit" className="btn btn-success">確認修改</button> 
                                <button type="reset" className="btn btn-outline-success">取消</button>
                            </div> */}
                            <ButtonGroup align="Center">
                                <Button type="submit" variant="primary01" size="sm">確認修改</Button>
                                <Button type="reset" variant="white" size="sm">取消</Button>
                            </ButtonGroup>
                        </form>

                    </div>
                </div>
            </div>
        </div>







    )
}
