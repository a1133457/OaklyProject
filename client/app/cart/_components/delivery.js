"use client";

import "@/styles/cart/delivery.css";
import { useEffect, useState } from "react";
import { useShip711StoreOpener } from "@/hooks/use-ship-711-store"; // 根據你的路徑調整
import { nextUrl } from "@/config/client.config"; // 根據你的路徑調整

export default function Delivery() {
  const [showForm, setShowForm] = useState(false);
  // 先讀 localStorage，初始值如果沒存過就空字串
  const [selectedDelivery, setSelectedDelivery] = useState("");

  // 整合 7-11 門市選擇功能
  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    `${nextUrl}/ship/api`, // 7-11 回調 API 路由
    { autoCloseMins: 3 }
  );


  // 在瀏覽器渲染後再讀取 localStorage
  useEffect(() => {
    const savedDelivery = localStorage.getItem("delivery");
    if (savedDelivery) {
      setSelectedDelivery(savedDelivery);
    }
  }, []);

  useEffect(() => {
    if (selectedDelivery) {
      localStorage.setItem("delivery", selectedDelivery);
    }
  }, [selectedDelivery]);

  return (
    <>
      <div className="delivery pc">
        <h4>運送方式</h4>
        <div className="d-list pc">
          <div className="form-check pc">
            <input
              className="form-check-input pc"
              type="radio"
              name="delivery"
              id="radioDefault1"
              checked={selectedDelivery === "宅配"}
              onChange={() => setSelectedDelivery("宅配")}
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
              name="delivery"
              id="radioDefault2"
              checked={selectedDelivery === "超商自取"}
              onChange={() => setSelectedDelivery("超商自取")}
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
          className={`toggleBtn ${showForm ? "active" : ""} phone`}
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
                    name="delivery"
                    id="radioDefault1"
                    checked={selectedDelivery === "宅配"}
                    onChange={() => setSelectedDelivery("宅配")}
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
                    name="delivery"
                    id="radioDefault2"
                    checked={selectedDelivery === "超商自取"}
                    onChange={() => setSelectedDelivery("超商自取")}
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
