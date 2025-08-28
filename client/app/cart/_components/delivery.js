"use client";

import "@/styles/cart/delivery.css";
import { useState } from "react";

export default function Delivery() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="delivery pc">
        <h4>運送方式</h4>
        <div className="d-list pc">
          <div className="form-check pc">
            <input
              className="form-check-input pc"
              type="radio"
              name="radioDefault"
              id="radioDefault1"
            />
            <label className="form-check-label pc" htmlFor="radioDefault1">
              <h6>宅配</h6>
            </label>
          </div>
          <p>運費 120 元，商品金額滿 1000 元免運費。</p>
        </div>
        <div className="d-list pc">
          <div className="form-check pc">
            <input
              className="form-check-input pc"
              type="radio"
              name="radioDefault"
              id="radioDefault2"
            />
            <label className="form-check-label pc" htmlFor="radioDefault2">
              <h6>超商自取</h6>
            </label>
          </div>
          <p>
            超商取貨之包裹規格限制為重量不超過 5
            公斤（含包裝），三邊長度合計不得超過 105 公分，且最長邊長度不得超過
            45 公分。
          </p>
        </div>
      </div>
      {/* 手機------------------------------------- */}
      <div className="delivery phone">
        <button
          className="toggleBtn phone"
          onClick={() => {
            setShowForm(!showForm);
          }}
          id="toggleBtn"
        >
          <h4>運送方式</h4>
        </button>
        {showForm && (
          <>
            <div className="d-lists phone">
              <div className="d-list phone">
                <div className="form-check phone">
                  <input
                    className="form-check-input phone"
                    type="radio"
                    name="radioDefault"
                    id="radioDefault1"
                  />
                  <label
                    className="form-check-label phone"
                    htmlFor="radioDefault1"
                  >
                    <h6>宅配</h6>
                  </label>
                </div>
                <p>運費 120 元，商品金額滿 1000 元免運費。</p>
              </div>
              <div className="d-list phone">
                <div className="form-check phone">
                  <input
                    className="form-check-input phone"
                    type="radio"
                    name="radioDefault"
                    id="radioDefault2"
                  />
                  <label
                    className="form-check-label phone"
                    htmlFor="radioDefault2"
                  >
                    <h6>超商自取</h6>
                  </label>
                </div>
                <p>
                  超商取貨之包裹規格限制為重量不超過 5
                  公斤（含包裝），三邊長度合計不得超過 105
                  公分，且最長邊長度不得超過 45 公分。
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
