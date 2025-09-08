"use client";

import "@/styles/cart/contactPerson.css";
import { useEffect, useState } from "react";
import EditInfo from "./editInfo";
import { useAuth } from "@/hooks/use-auth";

export default function ContactPerson() {
  const [showForm, setShowForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [buyer, setBuyer] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: `${user?.postcode || ""}${user?.city || ""}${user?.area || ""}${
      user?.address || ""
    }`,
  });
  const [recipient, setRecipient] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    // 如果有 useAuth 的 user 資料，也可以更新
    if (user) {
      setBuyer({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: `${user.postcode || ""}${user.city || ""}${user.area || ""}${
          user.address || ""
        }`,
      });
      setRecipient({
        name: user.recipient?.name || "",
        phone: user.recipient?.phone || "",
        email: user.recipient?.email || "",
        address: user.recipient?.address || "",
      });
    }
  }, [user]);

  const handleSamePerson = (e) => {
    if (e.target.checked) {
      setRecipient({
        name: buyer.name || "",
        phone: buyer.phone || "",
        address: buyer.address || "",
      });
    } else {
      setRecipient({
        name: "",
        phone: "",
        address: "",
      });
    }
    // 重新載入最新的 user 資料
    if (user) {
      setBuyer({
        name: user.buyer?.name || user.name || "",
        phone: user.buyer?.phone || user.phone || "",
        email: user.buyer?.email || user.email || "",
        address:
          user.buyer?.address ||
          `${user.postcode || ""}${user.city || ""}${user.area || ""}${
            user.address || ""
          }`,
      });

      setRecipient({
        name: user.recipient?.name || "",
        phone: user.recipient?.phone || "",
        email: user.recipient?.email || "",
        address: user.recipient?.address || "",
      });
    }
  };

  return (
    <>
      <div className="contact-person pc">
        <h4>聯絡人資訊</h4>
        <div className="contact pc">
          <div className="contact-detail1 pc">
            <div className="details pc">
              <div className="detail-one pc">
                <p>訂購人</p>
                <h6>{buyer?.name}</h6>
              </div>
              <div className="detail-one pc">
                <p>手機號碼</p>
                <h6>{buyer?.phone}</h6>
              </div>
              <div className="detail-one pc">
                <p>Email (訂單通知、電子發票寄送)</p>
                <h6>{buyer?.email}</h6>
              </div>
              {/* <div className="detail-one pc">
                <p>地址</p>
                <h6>{user.postcode + user.area + user.address}</h6>
              </div> */}
            </div>
            <button
              className="detail-button pc"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <p>編輯</p>
            </button>
            {isOpen && (
              <EditInfo type="buyer" onClose={() => setIsOpen(false)} />
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
                <p>訂購人</p>
                <h6>{recipient?.name || ""}</h6>
              </div>
              <div className="detail-one pc">
                <p>手機號碼</p>
                <h6>{recipient?.phone || ""}</h6>
              </div>
              <div className="detail-one pc">
                <p>地址</p>
                <h6>{recipient?.address || ""}</h6>
              </div>
            </div>
            <button
              className="detail-button pc"
              onClick={() => setIsOpen(!isOpen)}
            >
              <p>編輯</p>
            </button>
            {isOpen && (
              <EditInfo type="recipient" onClose={() => setIsOpen(false)} />
            )}
          </div>
        </div>
      </div>
      {/* 手機------------------------------- */}
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
                  <input type="checkbox" />
                  <p>同訂購人</p>
                </div>
                <div className="detail-one phone">
                  <p>訂購人</p>
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
