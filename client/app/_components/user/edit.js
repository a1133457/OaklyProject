// 'use client'

// export default function Login(){
//     return(
//         <>
//             <h1>登入狀態 stauts - edit</h1>
//             <p>預計要放大頭照跟名稱</p>
//         </>
//     )
// }
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
// import Sidebar from '../_components/sidebar'
// import HeaderImg from '../_components/HeaderImg'
import styles from '@/app/user/user.module.css'
import { useRouter } from 'next/navigation'

// 共用元件
import UserTextInput from '@/app/_components/UserTextInput'
import UserSelect from '@/app/_components/UserSelect'
import UserFormRow from '@/app/_components/UserFormRow'
import Button from '@/app/_components/Button'
import ButtonGroup from '@/app/_components/ButtonGroup'

export default function UserEditForm() {
    // api
    const router = useRouter();
    const { user, logout } = useAuth();

    // 登出按鈕
    // const onLogout = () => {
    //     logout();
     
    // };


    // 狀態欄位
    const [name, setName] = useState('')
    const [birthday, setBirthday] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [addr, setAddr] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [avatar, setAvatar] = useState(null)
    // 新增：頭像預覽 URL（避免每次 render 都 createObjectURL）
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [errors, setErrors] = useState({})

    // 接上面新增頭像
    useEffect(() => {
        if (!avatar) { setAvatarPreview(null); return; }
        const url = URL.createObjectURL(avatar);
        setAvatarPreview(url);
        return () => URL.revokeObjectURL(url); // 清掉暫時 URL，避免記憶體洩漏
    }, [avatar]);

    // 載入 user 後，填入表單
    useEffect(() => {
        if (!user) return
        setName(user.name ?? '')
        setBirthday(user.birthday ?? '')
        setPhone(user.phone ?? '')
        setCity(user.city ?? '')
        setDistrict(user.district ?? '')
        setAddr(user.address ?? '')
        setEmail(user.email ?? '')
        setPassword('')     // ✅ 密碼不回填
        setPassword2('')
    }, [user])

    const cities = [{ value: '臺北市', label: '臺北市' }, { value: '新北市', label: '新北市' }]
    const districts = city === '臺北市'
        ? ['中正區', '大安區', '信義區'].map(v => ({ value: v, label: v }))
        : city === '新北市'
            ? ['板橋區', '新莊區', '中和區'].map(v => ({ value: v, label: v }))
            : []

    // 表單送出
    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     console.log('送出表單:', { name, birthday, phone, city, district, addr, email, password, password2 })
    // }

    const handleSubmit = (e) => {
        e.preventDefault()
        const next = {}
        if (password && password !== password2) next.password2 = '兩次密碼不一致'
        setErrors(next)
        if (Object.keys(next).length) return

        // === 串接「修改會員資料」API ===
        // 👉 請把 API 改成你後端的路由（例如 /api/users/profile 或 /api/users/:id）
        const API = 'http://localhost:3005/api/users/profile';
        const token = localStorage.getItem('reactLoginToken');

        const form = new FormData();
        form.append('name', name);
        form.append('birthday', birthday);
        form.append('phone', phone);
        form.append('city', city);
        form.append('district', district);
        form.append('address', addr);
        form.append('email', email);
        if (password) form.append('password', password); // 有改才送
        if (avatar) form.append('avatar', avatar);       // 有選才送
    }

    // 表單重設
    const handleReset = () => {
        if (!user) return
        setName(user.name ?? '')
        setBirthday(user.birthday ?? '')
        setPhone(user.phone ?? '')
        setCity(user.city ?? '')
        setDistrict(user.district ?? '')
        setAddr(user.address ?? '')
        setEmail(user.email ?? '')
        setPassword('')
        setPassword2('')
        setAvatar(null)
    }



    return (
        <>
            {user && (
                <div>
                    {/* 大頭貼上傳 */}
                    <div className={`${styles.avatarUpload} ${styles.uploader}`}>
                        <label htmlFor="avatarInput">
                            <img src={avatar ? URL.createObjectURL(avatar) : '/img/ting/pexels-anntarazevich-8152002.jpg'}
                                alt="頭像預覽" className={styles.avatarImg} />

                        </label>
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
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

                        <UserTextInput id="password" label="新密碼" type="password"
                            value={password} onChange={e => setPassword(e.target.value)} />

                        <UserTextInput id="password2" label="確認新密碼" type="password"
                            value={password2} onChange={e => setPassword2(e.target.value)} error={errors.password2} />

                        {/* <div className="d-flex justify-content-center gap-2 mt-3 formButtons">
                                <button type="submit" className="btn btn-success">確認修改</button> 
                                <button type="reset" className="btn btn-outline-success">取消</button>
                            </div> */}
                        <ButtonGroup align="Center">
                            <Button type="submit" variant="primary01" size="sm">確認修改</Button>
                            <Button type="reset" variant="white" size="sm">取消</Button>
                            {/* <Button type="button" variant="white" size="sm" onClick={logout} >登出</Button> */}
                        </ButtonGroup>
                    </form>

                </div>
            )}
        </>

    );
}
