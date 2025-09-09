"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import "@/styles/cart/editInfo.css";

export default function EditInfo({ type, onClose }) {
  // 抓會員資料 + 更新函式
  const { user, updateUser } = useAuth();
  const [isClient, setIsClient] = useState(false); // 追蹤是否在客戶端
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    postcode: "",
    city: "",
    address: "",
    email: "",
  });

  // 確保只在客戶端執行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 取得完整資料的函數，只在客戶端執行
  const getFullUserData = () => {
    if (!isClient) return null; // 伺服器端直接返回 null

    if (user?.phone) {
      return user; // useAuth 有完整資料就用它
    }
    // 否則讀取 localStorage
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : user;
    } catch (error) {
      console.log("讀取 localStorage 失敗:", error);
      return user;
    }
  };

  useEffect(() => {
    if (!isClient) return; // 確保只在客戶端執行

    const fullUserData = getFullUserData();
    console.log("完整用戶資料:", fullUserData);

    if (fullUserData) {
      if (type === "buyer") {
        const buyerData = {
          name: fullUserData.buyer?.name || fullUserData.name || "",
          phone: fullUserData.buyer?.phone || fullUserData.phone || "",
          email: fullUserData.buyer?.email || fullUserData.email || "",
        };
        console.log("buyer formData:", buyerData);
        setFormData(buyerData);
      } else if (type === "recipient") {
        const recipientData = {
          name: fullUserData.recipient?.name || "",
          phone: fullUserData.recipient?.phone || "",
          postcode: fullUserData.recipient?.postcode || "",
          city: fullUserData.recipient?.city || "",
          address: fullUserData.recipient?.address || "",
          email: fullUserData.recipient?.email || "",
        };
        console.log("recipient formData:", recipientData);
        setFormData(recipientData);
      }
    }
  }, [user, type, isClient]);

  // 除錯：檢查 user 資料
  console.log("user:", user);
  console.log("user.buyer:", user?.buyer);
  console.log("user.recipient:", user?.recipient);

  // 沒有抓到 user 資料
  if (!isClient || !user) {
    return (
      <div className="overlay">
        <div className="list">
          <div>載入中...</div>
        </div>
      </div>
    );
  }
  const cleanType = String(type).trim();

  const handleSave = () => {
    // 更新 user 資料
    if (type === "buyer") {
      updateUser({ buyer: formData });
      // window.location.reload();
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
  }
  // else if (type === "recipient") {
  //   return (
  //     <div className="overlay">
  //       <div className="list">
  //         <h3 className="title">編輯資料</h3>

  //         {/* 訂購人 --------------------*/}
  //         {/* 表單欄位 */}
  //         <h6>收件人</h6>
  //         <div className="form-row">
  //           <label>姓名</label>
  //           <input
  //             type="text"
  //             value={formData.name}
  //             onChange={(e) =>
  //               setFormData({ ...formData, name: e.target.value })
  //             }
  //           />
  //         </div>

  //         <div className="form-row">
  //           <label>電話</label>
  //           <input
  //             type="text"
  //             value={formData.phone}
  //             onChange={(e) =>
  //               setFormData({ ...formData, phone: e.target.value })
  //             }
  //           />
  //         </div>

  //         <div className="form-row">
  //           <label>郵遞區號</label>
  //           <input
  //             type="text"
  //             value={formData.postcode}
  //             onChange={(e) =>
  //               setFormData({ ...formData, postcode: e.target.value })
  //             }
  //           />
  //         </div>

  //         <div className="form-row">
  //           <label>地區</label>
  //           <input
  //             type="text"
  //             value={formData.city}
  //             onChange={(e) =>
  //               setFormData({ ...formData, city: e.target.value })
  //             }
  //           />
  //         </div>

  //         <div className="form-row">
  //           <label>地址</label>
  //           <input
  //             type="text"
  //             value={formData.address}
  //             onChange={(e) =>
  //               setFormData({ ...formData, address: e.target.value })
  //             }
  //           />
  //         </div>

  //         {/* 按鈕 */}
  //         <div className="form-actions">
  //           <button onClick={onClose} className="cancel">
  //             取消
  //           </button>
  //           <button onClick={handleSave} className="save">
  //             儲存
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}
