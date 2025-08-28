"use client";

import "@/styles/cart/payment.css";
import { useState } from "react";

export default function Payment() {
  const [showForm, setShowForm] = useState(false);

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
          className="toggleBtn phone"
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
                  className="dropdown-toggle phone"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h4>發票類型</h4>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      <h6>手機條碼載具</h6>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <h6>紙本發票</h6>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown pay phone">
                <button
                  className="dropdown-toggle phone"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h4>付款方式</h4>
                </button>
                <ul className="dropdown-menu phone">
                  <li>
                    <a className="dropdown-item" href="#">
                      <h6>信用卡</h6>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <h6>超商付款</h6>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <h6>ATM付款</h6>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
