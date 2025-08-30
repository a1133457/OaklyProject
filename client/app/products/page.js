"use client";

import React, { useState, useEffect } from "react";
import "@/styles/products/products.css";
import { Link } from "react-router-dom";
import { useCart } from '@/app/contexts/CartContext';


const MainProduct = () => {
  
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [filterPriceRange, setFilterPriceRange] = useState({ min: 0, max: 50000 });

  
  

  const sortProducts = (products, sortBy) => {
    const sortedProducts = [...products];

    switch (sortBy) {
      case 'price_asc':
        return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_desc':
        return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'created_asc':
        return sortedProducts.sort((a, b) => new Date(a.create_at || 0) - new Date(b.create_at || 0));
      case 'created_desc':
        return sortedProducts.sort((a, b) => new Date(b.create_at || 0) - new Date(a.create_at || 0));
      default:
        return sortedProducts;
    }
  };

  // 修改篩選選項點擊處理
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // 重置到第一頁
  };

  const handleProductClick = (productId) => {
    window.location.href = `/products/${productId}`;
  };
  // 處理每頁顯示數量變更
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // 重置到第一頁
  };



  // 計算當前頁面要顯示的商品
  const getCurrentPageProducts = () => {
    const priceFilteredProducts = products.filter(product => {
      const price = product.price || 0;
      return price >= filterPriceRange.min && price <= filterPriceRange.max;
    });
    const sortedProducts = sortProducts(products, sortBy);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  };
  const getFilteredProducts = () => {
    return products.filter(product => {
      const price = product.price || 0;
      return price >= filterPriceRange.min && price <= filterPriceRange.max;
    });
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);



  // 處理頁面切換
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // 滾動到商品區域頂部
      document.querySelector('.products-grid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 生成分頁按鈕
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // 計算顯示範圍
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 調整起始頁
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 前一頁按鈕
    buttons.push(
      <button
        key="prev"
        className={`page-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
    );

    // 第一頁
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          className="page-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // 中間頁面
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // 最後一頁
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          className="page-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // 下一頁按鈕
    buttons.push(
      <button
        key="next"
        className={`page-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    );

    return buttons;
  };

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

  const currentProducts = getCurrentPageProducts();




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
            <select
              className="per-page-selection"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >   <option value={12}>每頁顯示 12 個</option>
              <option value={24}>每頁顯示 24 個</option>
              <option value={48}>每頁顯示 48 個</option>
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
                    <div
                      className={`filter-option ${sortBy === 'price_asc' ? 'active' : ''}`}
                      onClick={() => handleSortChange('price_asc')}
                    >售價 (由低到高)</div>
                    <div
                      className={`filter-option ${sortBy === 'price_desc' ? 'active' : ''}`}
                      onClick={() => handleSortChange('price_desc')}
                    >售價 (由高到低)</div>
                    <div
                      className={`filter-option ${sortBy === 'created_asc' ? 'active' : ''}`}
                      onClick={() => handleSortChange('created_asc')}
                    >上架時間 (由低到高)</div>
                    <div
                      className={`filter-option ${sortBy === 'created_desc' ? 'active' : ''}`}
                      onClick={() => handleSortChange('created_desc')}
                    >上架時間 (由高到低)</div>
                  </div>
                </div>


                {/* 價格 */}
                <div className="filter-section">
                  <h3 className="filter-title">價格</h3>
                  <div className="price-range">
                    <div className="price-slider">
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="1000"
                        value={filterPriceRange.max}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          setFilterPriceRange({ min: 0, max: newMax });
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <span>NT$ 0 - NT$ {filterPriceRange.max.toLocaleString()}</span>
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
                <select
                  className="per-page-selection"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >      <option value={12}>每頁顯示 12 個</option>
                  <option value={24}>每頁顯示 24 個</option>
                  <option value={48}>每頁顯示 48 個</option>
                </select>
              </div>
              <div className="view-toggle-container">
                <div className="view-toggle-title">家具</div>
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === "grid" ? "active" : ""
                      }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <img src="img/lan/menu.png" alt="list" />
                  </button>
                  <button
                    className={`view-btn ${viewMode === "list" ? "active" : ""
                      }`}
                    onClick={() => setViewMode("list")}
                  >
                    <img src="img/lan/lines.png" alt="list" />
                  </button>
                </div>
              </div>
              {/* 商品網格 */}

              <div className={`products-grid ${viewMode}`}>
                {currentProducts.map((product) => (
                  <div key={product.id}
                    className="productcard"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}>
                    <span className="badge-new">新品</span>
                    <div className="image">
                      {product.images.length > 0 && (
                        <img
                          src={`http://localhost:3005${product.images[0]}`}
                          alt={product.name}
                          style={{ maxWidth: "200px" }}
                        />
                      )}
                    </div>
                    <div className="info">
                      <h3 className="name">{product.name}</h3>
                      <p className="price">NT$ {product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="page-info">
              顯示 {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} 項，共 {filteredProducts.length} 項
              </div>

              {/* 分頁 */}
              {totalPages > 1 && (
                <div className="pagination">
                  {renderPaginationButtons()}

                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProduct;
