"use client";

import "@/styles/cart/contactPerson.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import EditInfoBuyer from "./editInfoBuyer";
import EditInfoRecipient from "./editInfoRecipient";

export default function ContactPerson() {
  const { updateUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isOpenB, setIsOpenB] = useState(false);
  const [isOpenR, setIsOpenR] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [localStorageUser, setLocalStorageUser] = useState(null);
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [recipient, setRecipient] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // 確保只在客戶端執行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 從 localStorage 讀取用戶資料
  useEffect(() => {
    

    try {
      const savedUser = localStorage.getItem("user");
      const savedBuyer = localStorage.getItem("buyer");
      if (savedBuyer) {
        const buyerData = JSON.parse(savedBuyer);
        console.log("從 localStorage 讀取的 buyer:", buyerData);
        setBuyer({
          name: buyerData.name || "",
          phone: buyerData.phone || "",
          email: buyerData.email || "",
          address: `${buyerData.postcode || ""}${buyerData.city || ""}${
            buyerData.area || ""
          }${buyerData.address || ""}`,
        });
      } else {
        const userData = JSON.parse(savedUser);
        console.log("從 localStorage 讀取的 user:", userData);
        setBuyer({
          name: userData.name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          address: `${userData.postcode || ""}${userData.city || ""}${
            userData.area || ""
          }${userData.address || ""}`,
        });
        console.log("從 localStorage 讀取的用戶資料:", userData);
      }
    } catch (error) {
      console.log("讀取 localStorage 失敗:", error);
    }
  }, []);

  // 同步 buyer 到 localStorage
  useEffect(() => {
    if (buyer.name || buyer.phone || buyer.email || buyer.address) {
      localStorage.setItem("buyer", JSON.stringify(buyer));
    }
  }, [buyer]);

  // 根據邏輯決定要顯示的資料
  // const getBuyerData = () => {
  //   if (!localStorageUser)
  //     return { name: "", phone: "", email: "", address: "" };

  //   // 如果有 buyer 就用 buyer，沒有就用 user 本身的資料
  //   if (localStorageUser.buyer) {
  //     console.log("使用 buyer 資料:", localStorageUser.buyer);
  //     return {
  //       name: localStorageUser.buyer.name || "",
  //       phone: localStorageUser.buyer.phone || "",
  //       email: localStorageUser.buyer.email || "",
  //       address:
  //         localStorageUser.buyer.address ||
  //         `${localStorageUser.buyer.postcode || ""}${
  //           localStorageUser.buyer.city || ""
  //         }${localStorageUser.buyer.area || ""}${
  //           localStorageUser.buyer.address || ""
  //         }`,
  //     };
  //   } else {
  //     console.log("使用 user 本身資料:", localStorageUser);
  //     return {
  //       name: localStorageUser.name || "",
  //       phone: localStorageUser.phone || "",
  //       email: localStorageUser.email || "",
  //       address: `${localStorageUser.postcode || ""}${
  //         localStorageUser.city || ""
  //       }${localStorageUser.area || ""}${localStorageUser.address || ""}`,
  //     };
  //   }
  // };

  // const getRecipientData = () => {
  //   if (!localStorageUser)
  //     return { name: "", phone: "", email: "", address: "" };

  //   // recipient 只從 user.recipient 取得
  //   const recipient = localStorageUser.recipient || {};
  //   return {
  //     name: localStorageUser.recipient?.name || "",
  //     phone: localStorageUser.recipient?.phone || "",
  //     email: localStorageUser.recipient?.email || "",
  //     address: localStorageUser.recipient?.address || "",
  //   };
  // };

  // const buyerData = getBuyerData();
  // const recipientData = getRecipientData();

  // // const [recipient, setRecipient] = useState(recipientData);

  // // 監聽 localStorage 用戶資料變化 更新 recipient
  // useEffect(() => {
  //   setRecipient(getRecipientData());
  // }, [localStorageUser]);

  const handleSamePerson = (e) => {
    const savedBuyer = localStorage.getItem("buyer");
    const buyerData = JSON.parse(savedBuyer);
    if (!isClient) return; // 只在客戶端執行

    if (e.target.checked) {
      setRecipient({
        name: buyerData.name || "",
        phone: buyerData.phone || "",
        address: buyerData.address || "",
      });
    } else {
      setRecipient({
        name: "",
        phone: "",
        address: "",
      });
    }
  };

  // 伺服器端渲染時顯示簡單的載入狀態，避免 Hydration 問題
  if (!isClient) {
    return (
      <>
        <div className="contact-person pc">
          <h4>聯絡人資訊</h4>
          <div className="contact pc">
            <div>載入中...</div>
          </div>
        </div>
        <div className="contact-person phone">
          <button className="toggleBtn phone">
            <h4>聯絡人資訊</h4>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="contact-person pc">
        <h4>聯絡人資訊</h4>
        <div className="contact pc">
          <div className="contact-detail1 pc">
            <div className="details pc">
              <div className="detail-one pc">
                <p>訂購人</p>
                <h6>{buyer.name || "未設定"}</h6>
              </div>
              <div className="detail-one pc">
                <p>手機號碼</p>
                <h6>{buyer.phone || "未設定"}</h6>
              </div>
              <div className="detail-one pc">
                <p>Email (訂單通知、電子發票寄送)</p>
                <h6>{buyer.email || "未設定"}</h6>
              </div>
            </div>
            <button
              className="detail-button pc"
              onClick={() => {
                setIsOpenB(!isOpenB);
              }}
            >
              <p>編輯</p>
            </button>
            {isOpenB && (
              <EditInfoBuyer onClose={() => setIsOpenB(false)} />
            )}
          </div>
          <div className="contact-line pc"></div>
          <div className="contact-detail2 pc">
            <div className="details pc">
              <div className="same-person pc">
                <input type="checkbox" onChange={handleSamePerson} />
                <p>同訂購人</p>
              </div>
              <div className="detail-one pc">
                <p>收件人</p>
                <h6>{recipient.name || ""}</h6>
              </div>
              <div className="detail-one pc">
                <p>手機號碼</p>
                <h6>{recipient.phone || ""}</h6>
              </div>
              <div className="detail-one pc">
                <p>地址</p>
                <h6>{recipient.address || ""}</h6>
              </div>
            </div>
            <button
              className="detail-button pc"
              onClick={() => setIsOpenR(!isOpenR)}
            >
              <p>編輯</p>
            </button>
            {isOpenR && (
              <EditInfoRecipient onClose={() => setIsOpenR(false)} />
            )}
          </div>
        </div>
      </div>
      {/* 手機版 */}
      <div className="contact-person phone">
        <button
          className={`toggleBtn ${showForm ? "active" : ""} phone`}
          onClick={() => {
            setShowForm(!showForm);
          }}
          id="toggleBtn"
        >
          <h4>聯絡人資訊</h4>
        </button>

        {showForm && (
          <div className="contact phone">
            <div className="contact-detail phone">
              <div className="details phone">
                <div className="detail-one phone">
                  <p>訂購人</p>
                  <h6>{buyer.name}</h6>
                </div>
                <div className="detail-one phone">
                  <p>手機號碼</p>
                  <h6>{buyer.phone}</h6>
                </div>
                <div className="detail-one phone">
                  <p>Email (訂單通知、電子發票寄送)</p>
                  <h6>{buyer.email}</h6>
                </div>
                <div className="detail-one phone">
                  <p>地址</p>
                  <h6>{buyer.address}</h6>
                </div>
              </div>
              <button className="detail-button phone">
                <p>編輯</p>
              </button>
            </div>
            <div className="contact-line phone"></div>
            <div className="contact-detail phone">
              <div className="details phone">
                <div className="same-person phone">
                  <input type="checkbox" onChange={handleSamePerson} />
                  <p>同訂購人</p>
                </div>
                <div className="detail-one phone">
                  <p>收件人</p>
                  <h6>{recipient.name}</h6>
                </div>
                <div className="detail-one phone">
                  <p>手機號碼</p>
                  <h6>{recipient.phone}</h6>
                </div>
                <div className="detail-one phone">
                  <p>地址</p>
                  <h6>{recipient.address}</h6>
                </div>
              </div>
              <button className="detail-button phone">
                <p>編輯</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
