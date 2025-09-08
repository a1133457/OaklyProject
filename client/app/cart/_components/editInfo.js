"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import "@/styles/cart/editInfo.css";

export default function EditInfo({ type, onClose }) {
  // 抓會員資料 + 更新函式
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    postcode: "",
    city: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    if (!user) return;
    if (type === "buyer") {
      setFormData({
        name: user.buyer?.name || user.name || "",
        phone: user.buyer?.phone || user.phone || "",
        postcode: user.buyer?.postcode || user.postcode || "",
        city: user.buyer?.city || user.city || "",
        address: user.buyer?.address || user.address || "",
        email: user.buyer?.email || user.email || "",
      });
    } else {
      setFormData({
        name: user.recipient?.name || "",
        phone: user.recipient?.phone || "",
        postcode: user.recipient?.postcode || "",
        city: user.recipient?.city || "",
        address: user.recipient?.address || "",
        email: user.recipient?.email || "",
      });
    }
  }, [user, type]);

  // 沒有抓到 user 資料
//   if (!user && type === "buyer") return null;

  const handleSave = () => {
    // 更新 user 資料
    if (type === "buyer") {
      updateUser({ buyer: formData });
    } else {
      updateUser({ recipient: formData });
    }
    onClose();
  };

  if (type === "buyer") {
    return (
      <div className="overlay">
        <div className="list">
          <h3 className="title">編輯資料</h3>

          {/* 訂購人 --------------------*/}
          {/* 表單欄位 */}
          <h6>訂購人</h6>
          <div className="form-row">
            <label>姓名</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>電話</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* <div className="form-row">
            <label>郵遞區號</label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) =>
                setFormData({ ...formData, postcode: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>地區</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>地址</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div> */}

          <div className="form-row">
            <label>Email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* 按鈕 */}
          <div className="form-actions">
            <button onClick={onClose} className="cancel">
              取消
            </button>
            <button onClick={handleSave} className="save">
              儲存
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="overlay">
        <div className="list">
          <h3 className="title">編輯資料</h3>

          {/* 訂購人 --------------------*/}
          {/* 表單欄位 */}
          <h6>收件人</h6>
          <div className="form-row">
            <label>姓名</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>電話</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>郵遞區號</label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) =>
                setFormData({ ...formData, postcode: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>地區</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label>地址</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* 按鈕 */}
          <div className="form-actions">
            <button onClick={onClose} className="cancel">
              取消
            </button>
            <button onClick={handleSave} className="save">
              儲存
            </button>
          </div>
        </div>
      </div>
    );
  }
}
