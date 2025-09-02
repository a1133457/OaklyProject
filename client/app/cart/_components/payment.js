"use client";

import "@/styles/cart/payment.css";
import { useState } from "react";

export default function Payment() {
  const [showForm, setShowForm] = useState(false);
  const [showI, setShowI] = useState(false);
  const [showP, setShowP] = useState(false);
  const [selectI, setSelectI] = useState("發票類型");
  const [selectP, setSelectP] = useState("付款方式");
  const [open, setOpen] = useState(false);

  const options = ["手機條碼載具", "紙本發票"];
  const payments = ["信用卡", "現金"];

  return (
    <>
      <div className="payment pc">
        <div className="pay pc">
          <h4>付款方式</h4>
          <div className="form-check pc">
            <input
              className="form-check-input pc"
              type="radio"
              name="radioDefault"
              id="radioDefault1"
            />
            <label className="form-check-label pc" htmlFor="radioDefault1">
              <h6>信用卡</h6>
            </label>
          </div>
          <div className="form-check pc">
            <input
              className="form-check-input pc"
              type="radio"
              name="radioDefault"
              id="radioDefault2"
            />
            <label className="form-check-label pc" htmlFor="radioDefault2">
              <h6>信用卡</h6>
            </label>
          </div>
        </div>
        <div className="p-line pc"></div>
        <div className="invoice pc">
          <h4>發票類型</h4>
          <div className="form-check pc">
            <input
              className="form-check-input pc"
              type="radio"
              name="radioDefault"
              id="radioDefault1"
            />
            <label className="form-check-label pc" htmlFor="radioDefault1">
              <h6>電子發票</h6>
            </label>
          </div>
          <div className="form-check pc">
            <input
              className="form-check-input pc"
              type="radio"
              name="radioDefault"
              id="radioDefault2"
            />
            <label className="form-check-label pc" htmlFor="radioDefault2">
              <h6>紙本發票</h6>
            </label>
          </div>
        </div>
      </div>

      {/* 手機------------------------------ */}
      <div className="payment phone">
        <button
          className={`toggleBtn ${showForm ? "active" : ""} phone`}
          onClick={() => {
            setShowForm(!showForm);
          }}
          id="toggleBtn"
        >
          <h4>付款方式</h4>
        </button>

        {showForm && (
          <>
            <div className="invoice-pay phone">
              <div className="dropdown invoice phone">
                <button
                  className={`toggleBtn2 ${showI ? "active" : ""} phone`}
                  onClick={() => {
                    setShowI(!showI);
                  }}
                  id="toggleBtn"
                >
                  <h6>{selectI}</h6>
                </button>
                {showI && (
                  <ul className="dropdown-menu">
                    {options.map((option) => (
                      <li key={option}>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setSelectI(option);
                            setShowI(false);
                          }}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {/* 額外輸入框 (只有某些選項會出現) */}
                {selectI === "手機條碼載具" && (
                  <div className="extra-input">
                    <input type="text" placeholder="請輸入手機條碼" />
                  </div>
                )}
              </div>

              {/* payment */}
              <div className="dropdown pay phone">
                <button
                  className={`toggleBtn2 ${showP ? "active" : ""} phone`}
                  onClick={() => {
                    setShowP(!showP);
                  }}
                  id="toggleBtn"
                >
                  <h6>{selectP}</h6>
                </button>
                {showP && (
                  <ul className="dropdown-menu">
                    {payments.map((payment) => (
                      <li key={payment}>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setSelectP(payment);
                            setShowP(false);
                          }}
                        >
                          {payment}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

              </div>
            </div>
          </>
        )}
      </div >
    </>
  );
}
