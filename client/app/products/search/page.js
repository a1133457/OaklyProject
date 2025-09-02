// 檔案路徑: /app/products/search/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import "@/styles/products/products.css";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');

  // 完全複用產品頁面的狀態
  const [selectedFilters, setSelectedFilters] = useState({
    colors: [],
    materials: [],
    series: []
  });
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(page);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [filterPriceRange, setFilterPriceRange] = useState({ min: 0, max: 50000 });
  const [tempFilters, setTempFilters] = useState({
    colors: [],
    materials: [],
    series: []
  });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 50000 });
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // 完全複用產品頁面的選項
  const colorMapping = {
    1: "白色",
    2: "黑色",
    3: "原木色",
    4: "淺灰",
    5: "深灰",
    6: "淺藍",
    7: "深藍",
    8: "淺綠",
    9: "深綠",
    10: "米黃色"
  };

  const colorOptions = [
    { name: '白色', value: '白色', color: '#FFFFFF' },
    { name: '黑色', value: '黑色', color: '#000000' },
    { name: '原木色', value: '原木色', color: '#DEB887' },
    { name: '淺灰', value: '淺灰', color: '#D3D3D3' },
    { name: '深灰', value: '深灰', color: '#555555' },
    { name: '淺藍', value: '淺藍', color: '#ADD8E6' },
    { name: '深藍', value: '深藍', color: '#62869D' },
    { name: '淺綠', value: '淺綠', color: '#DBE5DE' },
    { name: '深綠', value: '深綠', color: '#6B826B' },
    { name: '米黃色', value: '米黃色', color: '#F5F5DC' }
  ];

  const materialMapping = {
    1: "木質",
    2: "金屬",
    3: "塑膠",
    4: "皮革",
    5: "布料",
    6: "玻璃",
    7: "大理石",
    8: "藤",
    9: "亞克力",
    10: "竹"
  };

  const materialOptions = [
    "木質", "金屬", "塑膠", "皮革", "布料", "玻璃", "大理石", "藤", "亞克力", "竹"
  ];

  const seriesOptions = [
    "北歐簡約風", "現代極簡風", "工業復古風", "美式鄉村風", "輕奢設計風", "無印自然風"
  ];

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

  const handleFilterChange = (filterType, value, isChecked) => {
    setTempFilters(prev => {
      const newFilters = { ...prev };
      if (isChecked) {
        if (!newFilters[filterType].includes(value)) {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      }
      return newFilters;
    });
  };

  const handleColorFilter = (colorValue) => {
    const isSelected = tempFilters.colors.includes(colorValue);
    handleFilterChange('colors', colorValue, !isSelected);
  };

  const applyFilters = () => {
    setSelectedFilters(tempFilters);
    setFilterPriceRange(tempPriceRange);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const defaultFilters = { colors: [], materials: [], series: [] };
    const defaultPriceRange = { min: 0, max: 50000 };
    setTempFilters(defaultFilters);
    setTempPriceRange(defaultPriceRange);
    setSelectedFilters(defaultFilters);
    setFilterPriceRange(defaultPriceRange);
    setSortBy("default");
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleProductClick = (productId) => {
    window.location.href = `/products/${productId}`;
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getFilteredProducts = () => {
    const filtered = products.filter(product => {
      const price = product.price || 0;
      const priceMatch = price >= filterPriceRange.min && price <= filterPriceRange.max;

      const productColor = colorMapping[product.colors];
      const colorMatch = !selectedFilters.colors?.length ||
        selectedFilters.colors.includes(productColor);

      const productMaterial = materialMapping[product.materials_id];
      const materialMatch = !selectedFilters.materials?.length ||
        selectedFilters.materials.includes(productMaterial);

      const seriesMatch = !selectedFilters.series?.length ||
        selectedFilters.series.includes(product.style);

      return priceMatch && colorMatch && materialMatch && seriesMatch;
    });
    return filtered;
  };

  const getCurrentPageProducts = () => {
    const filteredProducts = getFilteredProducts();
    const sortedProducts = sortProducts(filteredProducts, sortBy);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.history.pushState({}, '', `/products/search?q=${encodeURIComponent(query)}&page=${page}`);
      document.querySelector('.products-grid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

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

    if (startPage > 1) {
      buttons.push(
        <button key={1} className="page-btn" onClick={() => handlePageChange(1)}>1</button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

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

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      buttons.push(
        <button key={totalPages} className="page-btn" onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </button>
      );
    }

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

  // 搜尋API調用
  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`http://localhost:3005/api/products/search?q=${encodeURIComponent(query)}&limit=1000`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            console.log('API 返回的原始資料:', data.data[0]); // 看第一筆資料

            // 轉換數據格式使其與產品頁面一致
            const productsWithImages = data.data.map(product => ({
              ...product,
            }));
            console.log('處理後的第一筆商品:', productsWithImages[0]); // 看處理後的資料

            setProducts(productsWithImages);
            setTotalResults(data.pagination?.total || productsWithImages.length);
          } else {
            setProducts([]);
            setTotalResults(0);
          }
        })
        .catch((err) => {
          console.error("搜尋 API 請求錯誤：", err);
          setProducts([]);
          setTotalResults(0);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  const currentProducts = getCurrentPageProducts();

  if (loading) {
    return (
      <div className="main-product-page">
        <div className="loading-container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div>搜尋中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-product-page">
      {/* 子導航欄 */}
      <div className="breadcrumb-nav-top">
        <div className="sub-nav-content">
          <div className="breadcrumb">
            <Link href="/">首頁</Link>
            <div className="arrow">&gt;</div>
            <Link href="/products">商品總頁</Link>
            <div className="arrow">&gt;</div>
            搜尋結果
          </div>
        </div>
      </div>

      <div className="alls">
        <div className="all-0">搜尋結果 "{query}"</div>
        <div className="all-1">找到 {totalResults} 個相關產品</div>
        <div className="all-2">
          為您精選符合「{query}」的優質家具，每一件都經過精心挑選，
          只為帶來溫潤木質與極簡設計的完美結合。
        </div>
      </div>

      {/* Hero 區域 */}
      <section className="hero">
        <img src="/img/lan/header.png" alt="hero" />
        <div className="hero-content">
          <h1 className="hero-title">搜尋結果</h1>
        </div>
      </section>

      <div className="sub-nav">
        <div className="sub-nav-links">
          <Link href="#" className="sub-nav-link">最新商品</Link>
          <Link href="#" className="sub-nav-link">熱賣</Link>
          <div className="dropdown hover-dropdown">
            <div className="sub-nav-link dropdown-toggle" aria-expanded="false">
              空間<i className="fas fa-chevron-down fa-sm"></i>
            </div>
            <div className="dropdown-menu dropdown-megamenu">
              <div className="megamenu-column">
                <h6 className="dropdown-header">客廳</h6>
                <Link className="dropdown-item" href="#">邊桌</Link>
                <Link className="dropdown-item" href="#">單椅/單人沙發</Link>
                <Link className="dropdown-item" href="#">茶几</Link>
                <Link className="dropdown-item" href="#">書櫃 / 書架</Link>
                <Link className="dropdown-item" href="#">書桌 / 書桌椅</Link>
                <Link className="dropdown-item" href="#">邊櫃 / 收納櫃</Link>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">廚房</h6>
                <Link className="dropdown-item" href="#">實木餐桌</Link>
                <Link className="dropdown-item" href="#">餐椅 / 椅子</Link>
                <Link className="dropdown-item" href="#">吧台桌</Link>
                <Link className="dropdown-item" href="#">吧台椅</Link>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">臥室</h6>
                <Link className="dropdown-item" href="#">床架</Link>
                <Link className="dropdown-item" href="#">床邊桌</Link>
                <Link className="dropdown-item" href="#">化妝台</Link>
                <Link className="dropdown-item" href="#">全身鏡 / 鏡子</Link>
                <Link className="dropdown-item" href="#">衣櫃 / 衣架</Link>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">兒童房</h6>
                <Link className="dropdown-item" href="#">桌椅組</Link>
                <Link className="dropdown-item" href="#">衣櫃</Link>
                <Link className="dropdown-item" href="#">床架</Link>
                <Link className="dropdown-item" href="#">收納櫃</Link>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">收納空間</h6>
                <Link className="dropdown-item" href="#">收納盒 / 收納箱</Link>
              </div>
            </div>
          </div>
          <Link href="#" className="sub-nav-link">It's Oakly</Link>
        </div>
      </div>

      {/* 子導航欄 */}
      <div className="breadcrumb-nav">
        <div className="sub-nav-content">
          <div className="breadcrumb">
            <Link href="/">首頁</Link>
            <div className="arrow">&gt;</div>
            <Link href="/products">商品總頁</Link>
            <div className="arrow">&gt;</div>
            搜尋結果
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="content">
        <div className="mid-sec">
          <div className="filter">
            <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.0308 0H0.969295C0.552928 0 0.34283 0.505195 0.637849 0.800215L4.25 4.41291V8.4375C4.25 8.59045 4.32463 8.73379 4.44994 8.82152L6.01244 9.91488C6.3207 10.1307 6.75 9.91197 6.75 9.53086V4.41291L10.3622 0.800215C10.6567 0.505781 10.448 0 10.0308 0Z" fill="#8B8B8B" />
            </svg>
            篩選
          </div>
          <div className="sort">
            排列方式
            <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.77203 3.89391L6.88731 0.960529C7.03756 0.819055 7.03756 0.58969 6.88731 0.448232L6.52397 0.106102C6.37398 -0.0351305 6.13088 -0.0354021 5.98054 0.105498L3.49999 2.43025L1.01946 0.105498C0.869116 -0.0354021 0.626024 -0.0351305 0.476033 0.106102L0.112686 0.448232C-0.0375618 0.589705 -0.0375618 0.81907 0.112686 0.960529L3.22797 3.89389C3.3782 4.03537 3.62179 4.03537 3.77203 3.89391Z" fill="#8B8B8B" />
            </svg>
          </div>
          <div className="per-page-select">
            <select className="per-page-selection" value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={12}>每頁顯示 12 個</option>
              <option value={24}>每頁顯示 24 個</option>
              <option value={48}>每頁顯示 48 個</option>
            </select>
          </div>
        </div>

        <div className="products-container">
          <div className="wrapper">
            {/* 左側邊欄 - 完全複用產品頁面 */}
            <aside className="sidebar">
              <div className="filter-sections">
                <div className="filter-section">
                  <h3 className="filter-title">篩選</h3>
                  <div className="filter-options">
                    <div className={`filter-option ${sortBy === 'price_asc' ? 'active' : ''}`} onClick={() => handleSortChange('price_asc')}>
                      售價 (由低到高)
                    </div>
                    <div className={`filter-option ${sortBy === 'price_desc' ? 'active' : ''}`} onClick={() => handleSortChange('price_desc')}>
                      售價 (由高到低)
                    </div>
                    <div className={`filter-option ${sortBy === 'created_asc' ? 'active' : ''}`} onClick={() => handleSortChange('created_asc')}>
                      上架時間 (由低到高)
                    </div>
                    <div className={`filter-option ${sortBy === 'created_desc' ? 'active' : ''}`} onClick={() => handleSortChange('created_desc')}>
                      上架時間 (由高到低)
                    </div>
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">價格</h3>
                  <div className="price-range">
                    <div className="price-slider">
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="1000"
                        value={tempPriceRange.max}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          setTempPriceRange({ min: 0, max: newMax });
                        }}
                      />
                    </div>
                    <span>NT$ 0 - NT$ {tempPriceRange.max.toLocaleString()}</span>
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">顏色</h3>
                  <div className="color-options">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        className={`color-option ${tempFilters?.colors?.includes(color.value) ? 'selected' : ''}`}
                        style={{ backgroundColor: color.color }}
                        onClick={() => handleColorFilter(color.value)}
                        title={color.name}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">材質</h3>
                  <div className="filter-options">
                    {materialOptions.map((material) => (
                      <div key={material} className="option">
                        <input
                          type="checkbox"
                          checked={tempFilters?.materials?.includes(material) || false}
                          onChange={(e) => handleFilterChange('materials', material, e.target.checked)}
                        />
                        <span>{material}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">系列</h3>
                  <div className="filter-options">
                    {seriesOptions.map((series) => (
                      <div key={series} className="option">
                        <input
                          type="checkbox"
                          checked={tempFilters?.series?.includes(series) || false}
                          onChange={(e) => handleFilterChange('series', series, e.target.checked)}
                        />
                        <span>{series}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="filter-buttons">
                <button className="filter-btn" onClick={applyFilters}>
                  <img src="../img/lan/filter2.svg" alt="filter" />套用篩選
                </button>
                <button className="reset-btn" onClick={clearFilters}>清除</button>
              </div>
            </aside>

            {/* 右側商品區域 - 完全複用產品頁面 */}
            <main className="products-section">
              <div className="per-page-select">
                <select className="per-page-selection" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  <option value={12}>每頁顯示 12 個</option>
                  <option value={24}>每頁顯示 24 個</option>
                  <option value={48}>每頁顯示 48 個</option>
                </select>
              </div>

              <div className="view-toggle-container">
                <div className="view-toggle-title">搜尋結果</div>
                <div className="view-toggle">
                  <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
                    <img src="../img/lan/menu.png" alt="grid" />
                  </button>
                  <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
                    <img src="../img/lan/lines.png" alt="list" />
                  </button>
                </div>
              </div>

              {/* 商品網格 - 完全複用產品頁面 */}
              {currentProducts.length > 0 ? (
                <div className={`products-grid ${viewMode}`}>
                  {currentProducts.map((product) => (
                    <div key={product.id} className="productcard" onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
                      <span className="badge-new">新品</span>
                      <div className="image">
                        {product.images.length > 0 && (
                          <img
                          src={`http://localhost:3005${product.images[0]}`} 
                          alt={product.name}
                            style={{ maxWidth: "200px" }}
                            onLoad={(e) => {
                              console.log(' 圖片載入成功');
                              console.log('成功的路徑:', e.target.src);
                            }}
                            onError={(e) => {
                              console.log('❌ 圖片載入失敗，原始路徑:', e.target.src);
                              console.log('product.image 內容:', product.image);
                              console.log('product.images 內容:', product.images);
                              // 嘗試不同的路徑
                              if (e.target.src.includes('../uploads/')) {
                                e.target.src = `/uploads/${product.image}`;
                                console.log('嘗試絕對路徑:', e.target.src);
                              } else if (e.target.src.includes('/uploads/')) {
                                e.target.src = `http://localhost:3005/uploads/${product.image}`;
                                console.log('嘗試完整 URL:', e.target.src);
                              } else {
                                console.log('所有路徑都嘗試失敗');
                                // 設置一個預設圖片
                                e.target.src = 'https://picsum.photos/200/300';
                              }
                            }}
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
              ) : (
                <div className="nosearchfit">
                  <h3>沒有找到符合條件的產品</h3>
                  <p>請嘗試調整篩選條件或搜尋其他關鍵字</p>
                  <Link href="/products" style={{ color: '#DBA783', textDecoration: 'none', fontSize:'14px' }}>
                    瀏覽所有產品
                  </Link>
                </div>
              )}

              <div className="page-info">
                顯示 {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} 項，共 {filteredProducts.length} 項
              </div>

              {/* 分頁 - 完全複用產品頁面 */}
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