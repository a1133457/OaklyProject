//         <>
//             <h1>登入狀態 stauts - edit</h1>
//             <p>預計要放大頭照跟名稱</p>
//         </>

'use client'

import styles from '@/app/user/user.module.css'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
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
    const { user, logout, updateUserEdit, updateUserPassword, updateUserAvatar } = useAuth();
    // 登出按鈕
    // const onLogout = () => {logout();};

    // 狀態欄位
    const [name, setName] = useState('')
    const [birthday, setBirthday] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [addr, setAddr] = useState('')
    // const [postcode, setPostcode] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [avatar, setAvatar] = useState(null)
    // 新增：頭像預覽 URL（避免每次 render 都 createObjectURL）
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

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
        setDistrict(user.area ?? user.district ?? '')
        // setPostcode(user.postcode ?? '')
        setAddr(user.address ?? '')
        setEmail(user.email ?? '')
        setPassword('')     // ✅ 密碼不回填
        setPassword2('')
    }, [user])
    // 城市、地區選單
    const cities = [{ value: '臺北市', label: '臺北市' }, { value: '新北市', label: '新北市' }]
    //「地區選項陣列」用 districts 這個名稱，避免和 DB 欄位 area 混淆
    const districts  = city === '臺北市'
        ? ['中正區', '大安區', '信義區'].map(v => ({ value: v, label: v }))
        : city === '新北市'
            ? ['板橋區', '新莊區', '中和區'].map(v => ({ value: v, label: v }))
            : []

    // 表單送出
    const handleSubmit = async (e) => {
        e.preventDefault()
        // 1) 前端驗證：密碼一致
        const next = {}
        if (password && password !== password2) next.password2 = '兩次密碼不一致'
        setErrors(next)
        if (Object.keys(next).length) return

        if (!user?.id) {
            alert('找不到使用者 ID，請重新登入後再試')
            return
        }

        // 更新文字欄位：name/phone/postcode/city/area/address
        const payload = {
            name,
            phone,
            city,
            area: district,  // 送後端的 area 來自 district
            address: addr,   // 你 state 叫 addr，送出要轉回 address
            birthday
        }
        setSaving(true);
        const messages = [];
        try {
            // 2-1 一般資料
            const base = await updateUserEdit(user.id, payload);
            messages.push(`一般資料：${base.success ? '✔ 成功' : `✘ 失敗（${base.message || '未知原因'}）`}`);

            // 2-2 密碼（有填才送）
            if (password) {
                const pw = await updateUserPassword(user.id, password);
                messages.push(`密碼：${pw.success ? '✔ 成功' : `✘ 失敗（${pw.message || '未知原因'}）`}`);
                if (pw.success) { setPassword(''); setPassword2(''); }
            }

            // 2-3 頭像（有選檔才送）
            if (avatar) {
                const av = await updateUserAvatar(user.id, avatar);
                messages.push(`頭像：${av.success ? '✔ 成功' : `✘ 失敗（${av.message || '未知原因'}）`}`);
                if (av.success) { setAvatar(null); } // 清掉暫存檔
            }
            alert(messages.join('\n'));
        } catch (err) {
            alert('伺服器錯誤，請稍後再試');
        } finally {
            setSaving(false);
        }
    };

    // 表單重設
    const handleReset = () => {
        if (!user) return
        setName(user.name ?? '')
        setBirthday(user.birthday ?? '')
        setPhone(user.phone ?? '')
        setCity(user.city ?? '')
        setDistrict(user.area ?? user.district ?? '')
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
                            <img src={avatarPreview || user?.avatar || '/img/ting/pexels-anntarazevich-8152002.jpg'}
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
                            value={email} onChange={e => setEmail(e.target.value)} readOnly />

                        <UserTextInput id="password" label="新密碼" type="password"
                            value={password} onChange={e => setPassword(e.target.value)} />

                        <UserTextInput id="password2" label="確認新密碼" type="password"
                            value={password2} onChange={e => setPassword2(e.target.value)} error={errors.password2} />

                        {/* <div className="d-flex justify-content-center gap-2 mt-3 formButtons">
                                <button type="submit" className="btn btn-success">確認修改</button> 
                                <button type="reset" className="btn btn-outline-success">取消</button>
                            </div> */}
                        <ButtonGroup align="Center">
                            <Button type="submit" variant="primary01" size="sm" disabled={saving}>{saving ? '儲存中…' : '確認修改'}</Button>
                            <Button type="reset" variant="white" size="sm">取消</Button>
                            {/* <Button type="button" variant="white" size="sm" onClick={logout} >登出</Button> */}
                        </ButtonGroup>
                    </form>

                </div>
            )}
        </>

    );
}
