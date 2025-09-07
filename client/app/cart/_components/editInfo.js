"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import "./styles/cart/editInfo.css";

export default function EditInfo({ type, buyer, recipient, onClose, onSave }) {
    // 抓會員資料 + 更新函式
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({ name: "", phone: "", postcode: "", city: "", address: "", email: "" });


    useEffect(() => {
        if (user && type === "buyer") {
            // 初始化表單，訂購人抓 user 資料
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                postcode: user.postcode || "",
                city: user.city || "",
                address: user.address || "",
                email: user.email || "",
            });
        }else{
            // 收件人一開始全部空白
            setFormData({ name: "", phone: "", postcode: "", city: "", address: "", email: "" });
        }
    }, [user, type]);

    // 沒有抓到 user 資料
    if (!user && type === "buyer") return null;

    const handleSave = () =>{
        // 更新 user 資料
        if(type === "buyer"){
            updateUser({buyer: formData});
        }else{
            updateUser({recipient: formData});
        }
        onClose();
    }

    if (type === "buyer") {
        return (
            <div className="overlay">
                <div className="list">
                    <h3 className="title">編輯資料</h3>

                    {/* 訂購人 --------------------*/}
                    <h4 className="subtitle">訂購人</h4>
                    <input
                        type="text"
                        placeholder="姓名"
                        className="edit-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="電話"
                        className="edit-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="郵遞區號"
                        className="edit-input"
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="地區"
                        className="edit-input"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="地址"
                        className="edit-input"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />

                </div >
            </div >

        )

    } else {
        return (
            <div className="overlay">
                <div className="list">
                    <h3 className="title">編輯資料</h3>
                    {/* 收件人 ------------------------*/}
                    <h4 className="subtitle">收件人</h4>
                    <input
                        type="text"
                        placeholder="姓名"
                        className="edit-input"
                        value={formData.name}
                        onChange={(e) => setNewRecipient({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="電話"
                        className="edit-input"
                        value={formData.phone}
                        onChange={(e) => setNewRecipient({ ...formData, phone: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="郵遞區號"
                        className="edit-input"
                        value={formData.postcode}
                        onChange={(e) => setNewRecipient({ ...formData, postcode: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="地區"
                        className="edit-input"
                        value={formData.city}
                        onChange={(e) => setNewRecipient({ ...formData, area: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="地址"
                        className="edit-input"
                        value={formData.address}
                        onChange={(e) => setNewRecipient({ ...formData, address: e.target.value })}
                    />

                    {/* 按鈕 */}
                    <div className={styles.actions}>
                        <button onClick={onClose} className={styles.cancel}>
                            取消
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="save"
                        >
                            儲存
                        </button>
                    </div>


                </div >
            </div >

        )
    }
}