"use client";

import "@/styles/cart/contactPerson.css";
import { useState } from "react";
import EditInfo from "./editInfo";
import { useAuth } from "@/hooks/use-auth";


export default function ContactPerson() {
  const [showForm, setShowForm] = useState(false);
   const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();

  return (
    <>
      <div className="contact-person pc">
        <h4>聯絡人資訊</h4>
        <div className="contact pc">
          <div className="contact-detail1 pc">
            <div className="details pc">
              <div className="detail-one pc">
                <p>訂購人</p>
                <h6>{user.name}</h6>
              </div>
              <div className="detail-one pc">
                <p>手機號碼</p>
                <h6>{user.phone}</h6>
              </div>
              <div className="detail-one pc">
                <p>Email (訂單通知、電子發票寄送)</p>
                <h6>{user.email}</h6>
              </div>
              <div className="detail-one pc">
                <p>地址</p>
                <h6>{user.postcode + user.area + user.address}</h6>
              </div>
            </div>
            <button className="detail-button pc">
              <p>編輯</p>
            </button>
          </div>
          <div className="contact-line pc"></div>
          <div className="contact-detail2 pc">
            <div className="details pc">
              <div className="same-person pc">
                <input type="checkbox" />
                <p>同訂購人</p>
              </div>
              <div className="detail-one pc">
                <p>訂購人</p>
                <h6>{name}</h6>
              </div>
              <div className="detail-one pc">
                <p>手機號碼</p>
                <h6>{phone}</h6>
              </div>
              <div className="detail-one pc">
                <p>地址</p>
                <h6>{address}</h6>
              </div>
            </div>
            <button className="detail-button pc">
              <p>編輯</p>
            </button>
          </div>
        </div>
      </div>
      {/* 手機------------------------------- */}
      <div className="contact-person phone">
        <button className={`toggleBtn ${showForm ? "active" : ""} phone`}
          onClick={() => { setShowForm(!showForm) }}
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
                  <h6>{name}</h6>
                </div>
                <div className="detail-one phone">
                  <p>手機號碼</p>
                  <h6>{phone}</h6>
                </div>
                <div className="detail-one phone">
                  <p>Email (訂單通知、電子發票寄送)</p>
                  <h6>{email}</h6>
                </div>
                <div className="detail-one phone">
                  <p>地址</p>
                  <h6>{address}</h6>
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
                  <h6>{name}</h6>
                </div>
                <div className="detail-one phone">
                  <p>手機號碼</p>
                  <h6>{phone}</h6>
                </div>
                <div className="detail-one phone">
                  <p>地址</p>
                  <h6>{address}</h6>
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
