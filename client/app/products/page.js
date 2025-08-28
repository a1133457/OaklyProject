"use client";

import React, { useState, useEffect } from "react";
import "@/styles/products/products.css";

const MainProduct = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);

  //產品api
  useEffect(() => {
    fetch("http://localhost:3005/api/products")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setProducts(Array.isArray(json) ? json : []);
      })
      .catch((err) => {
        console.error("產品 API 請求錯誤：", err);
      });
  }, []);

  return (
    <div className="main-product-page">
      {/* 子導航欄 */}
      <div className="breadcrumb-nav-top">
        <div className="sub-nav-content">
          <div className="breadcrumb">
            <a href="/">首頁</a>
            <div className="arrow">&gt;</div>
            商品總頁
          </div>
        </div>
      </div>
      <div className="alls">
        <div className="all-0">全部商品</div>
        <div className="all-1">Oakly 質感家具，打造理想生活空間</div>
        <div className="all-2">
          精選每一件家具，只為帶來溫潤木質與極簡設計的完美結合。從客廳到臥室，Oakly
          讓家的每個角落都充滿溫度與品味。立即探索，找尋屬於你的生活風格。
        </div>
      </div>
      {/* Hero 區域 */}
      <section className="hero">
        <img src="/img/lan/header.png" alt="hero" />
        <div className="hero-content">
          <h1 className="hero-title">全部商品</h1>
        </div>
      </section>
      <div className="sub-nav">
        <div className="sub-nav-links">
          <a href="#" className="sub-nav-link">
            最新商品
          </a>
          <a href="#" className="sub-nav-link">
            熱賣
          </a>
          <div className="dropdown hover-dropdown">
            <div
              className="sub-nav-link dropdown-toggle"
              // data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              空間<i className="fas fa-chevron-down  fa-sm"></i>
            </div>
            <div className="dropdown-menu dropdown-megamenu">
              <div className="megamenu-column">
                <h6 className="dropdown-header">客廳</h6>
                <a className="dropdown-item" href="#">
                  邊桌
                </a>
                <a className="dropdown-item" href="#">
                  單椅/單人沙發
                </a>
                <a className="dropdown-item" href="#">
                  茶几
                </a>
                <a className="dropdown-item" href="#">
                  書櫃 / 書架
                </a>
                <a className="dropdown-item" href="#">
                  書桌 / 書桌椅
                </a>
                <a className="dropdown-item" href="#">
                  邊櫃 / 收納櫃
                </a>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">廚房</h6>
                <a className="dropdown-item" href="#">
                  實木餐桌
                </a>
                <a className="dropdown-item" href="#">
                  餐椅 / 椅子
                </a>
                <a className="dropdown-item" href="#">
                  吧台桌
                </a>
                <a className="dropdown-item" href="#">
                  吧台椅
                </a>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">臥室</h6>
                <a className="dropdown-item" href="#">
                  床架
                </a>
                <a className="dropdown-item" href="#">
                  床邊桌
                </a>
                <a className="dropdown-item" href="#">
                  化妝台
                </a>
                <a className="dropdown-item" href="#">
                  全身鏡 / 鏡子
                </a>
                <a className="dropdown-item" href="#">
                  衣櫃 / 衣架
                </a>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">兒童房</h6>
                <a className="dropdown-item" href="#">
                  桌椅組
                </a>
                <a className="dropdown-item" href="#">
                  衣櫃
                </a>
                <a className="dropdown-item" href="#">
                  床架
                </a>
                <a className="dropdown-item" href="#">
                  收納櫃
                </a>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">收納空間</h6>
                <a className="dropdown-item" href="#">
                  收納盒 / 收納箱
                </a>
              </div>
            </div>
          </div>

          <a href="#" className="sub-nav-link">
            It's Oakly
          </a>
        </div>
      </div>

      {/* 子導航欄 */}
      <div className="breadcrumb-nav">
        <div className="sub-nav-content">
          <div className="breadcrumb">
            <a href="/">首頁</a>
            <div className="arrow">&gt;</div>
            商品總頁
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="content">
        <div className="mid-sec">
          <div className="filter">
            <svg
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0308 0H0.969295C0.552928 0 0.34283 0.505195 0.637849 0.800215L4.25 4.41291V8.4375C4.25 8.59045 4.32463 8.73379 4.44994 8.82152L6.01244 9.91488C6.3207 10.1307 6.75 9.91197 6.75 9.53086V4.41291L10.3622 0.800215C10.6567 0.505781 10.448 0 10.0308 0Z"
                fill="#8B8B8B"
              />
            </svg>
            篩選
          </div>
          <div className="sort">
            排列方式
            <svg
              width="7"
              height="4"
              viewBox="0 0 7 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.77203 3.89391L6.88731 0.960529C7.03756 0.819055 7.03756 0.58969 6.88731 0.448232L6.52397 0.106102C6.37398 -0.0351305 6.13088 -0.0354021 5.98054 0.105498L3.49999 2.43025L1.01946 0.105498C0.869116 -0.0354021 0.626024 -0.0351305 0.476033 0.106102L0.112686 0.448232C-0.0375618 0.589705 -0.0375618 0.81907 0.112686 0.960529L3.22797 3.89389C3.3782 4.03537 3.62179 4.03537 3.77203 3.89391Z"
                fill="#8B8B8B"
              />
            </svg>
          </div>
          <div className="per-page-select">
            <select className="per-page">
              <option>每頁顯示 12 個</option>
              <option>每頁顯示 24 個</option>
              <option>每頁顯示 48 個</option>
            </select>
          </div>
        </div>
        <div className="products-container">
          <div className="wrapper">
            {/* 左側邊欄 */}
            <aside className="sidebar">
              <div className="filter-sections">
                {/* 分類 */}
                <div className="filter-section">
                  <h3 className="filter-title">篩選</h3>
                  <div className="filter-options">
                    <div className="filter-option">商品類別</div>
                    <div className="filter-option">售價 (由低到高)</div>
                    <div className="filter-option">售價 (由高到低)</div>
                    <div className="filter-option">上架時間 (由低到高)</div>
                    <div className="filter-option">上架時間 (由高到低)</div>
                  </div>
                </div>

                {/* 價格 */}
                <div className="filter-section">
                  <h3 className="filter-title">價格</h3>
                  <div className="price-range">
                    <div className="price-slider">
                      <input type="range" min="0" max="9999" />
                    </div>
                    <span>NT$ 9999</span>
                  </div>
                </div>

                {/* 顏色 */}
                <div className="filter-section">
                  <h3 className="filter-title">顏色</h3>
                  <div className="color-options">
                    <div
                      className="color-option"
                      style={{ backgroundColor: "#000" }}
                    ></div>
                    <div
                      className="color-option"
                      style={{ backgroundColor: "#666" }}
                    ></div>
                    <div
                      className="color-option"
                      style={{ backgroundColor: "#2d5016" }}
                    ></div>
                    <div
                      className="color-option"
                      style={{ backgroundColor: "#87ceeb" }}
                    ></div>
                    <div
                      className="color-option"
                      style={{ backgroundColor: "#8b4513" }}
                    ></div>
                  </div>
                </div>

                {/* 材質 */}
                <div className="filter-section">
                  <h3 className="filter-title">材質</h3>
                  <div className="filter-options">
                    {["金屬", "木頭", "塑膠", "皮革", "布料", "其他"].map(
                      (material) => (
                        <div key={material} className="option">
                          <input type="checkbox" />
                          <span>{material}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* 系列 */}
                <div className="filter-section">
                  <h3 className="filter-title">系列</h3>
                  <div className="filter-options">
                    {["SOMNULI", "TJENA", "CLABOW", "GOREN"].map((brand) => (
                      <div key={brand} className="option">
                        <input type="checkbox" />
                        <span>{brand}</span>
                      </div>
                    ))}
                    <span>更多</span>
                  </div>
                </div>
              </div>

              {/* 篩選按鈕 */}
              <div className="filter-buttons">
                <button className="filter-btn">
                  <img src="img/lan/filter2.svg"></img>套用篩選
                </button>
                <button className="reset-btn">清除</button>
              </div>
            </aside>

            {/* 右側商品區域 */}

            <main className="products-section">
              <div className="per-page-select">
                <select className="per-page-selection">
                  <option>每頁顯示 12 個</option>
                  <option>每頁顯示 24 個</option>
                  <option>每頁顯示 48 個</option>
                </select>
              </div>
              <div className="view-toggle-container">
                <div className="view-toggle-title">家具</div>
                <div className="view-toggle">
                  <button
                    className={`view-btn ${
                      viewMode === "grid" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <img src="img/lan/menu.png" alt="list" />
                  </button>
                  <button
                    className={`view-btn ${
                      viewMode === "list" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <img src="img/lan/lines.png" alt="list" />
                  </button>
                </div>
              </div>
              {/* 商品網格 */}

              <div className={`products-grid ${viewMode}`}>
                {products.map((product) => (
                  <div key={product.id} className="productcard">
                    <span className="badge-new">新品</span>
                    <div className="image">
                      {product.images.map((imgUrl, index) => (
                        <img
                          key={index}
                          src={`http://localhost:3005${imgUrl}`} // ← 加上正確主機位址
                          alt={product.name}
                          style={{ maxWidth: "200px" }}
                        />
                      ))}
                    </div>
                    <div className="info">
                      <h3 className="name">{product.name}</h3>
                      <p className="price">NT$ {product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分頁 */}
              <div className="pagination">
                <button className="page-btn prev">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">4</button>
                <button className="page-btn next">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProduct;
