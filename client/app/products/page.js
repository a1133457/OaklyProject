"use client";

import React, { useState, useEffect } from "react";
import "@/styles/products/products.css";
import { Link } from "react-router-dom";
import { useCart } from '@/app/contexts/CartContext';


const MainProduct = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    colors: [],
    materials: [],
    series: []
  }); const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [filterPriceRange, setFilterPriceRange] = useState({ min: 0, max: 50000 });
  const [tempFilters, setTempFilters] = useState({
    colors: [],
    materials: [],
    series: []
  });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 50000 });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const categoryMapping = {
    // 客廳分類
    '邊桌': '客廳',
    '單椅': '客廳',
    '茶几': '客廳',
    '書櫃': '客廳',
    '書桌': '客廳',
    '邊櫃': '客廳',
    // 廚房分類
    '實木餐桌': '廚房',
    '餐椅': '廚房',
    '吧台桌': '廚房',
    '吧台椅': '廚房',
    // 臥室分類
    '床架': '臥室',
    '床邊桌': '臥室',
    '化妝台': '臥室',
    '全身鏡': '臥室',
    '衣櫃': '臥室',
    // 兒童房分類
    '桌椅組': '兒童房',
    // 收納空間分類
    '收納盒': '收納空間',
    '收納櫃': '收納空間'
  };


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

  // 材质选项
  const materialOptions = [
    "木質", "金屬", "塑膠", "皮革", "布料", "玻璃", "大理石", "藤", "亞克力", "竹"
  ];

  // 系列选项
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

  // 篩選条件
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
    setSelectedFilters(tempFilters);        // 將臨時篩選設定為實際篩選
    setFilterPriceRange(tempPriceRange);    // 將臨時價格設定為實際價格
    setCurrentPage(1);
  };
  // 清除篩選
  const clearFilters = () => {
    const defaultFilters = {
      colors: [],
      materials: [],
      series: []
    };
    const defaultPriceRange = { min: 0, max: 50000 };

    setTempFilters(defaultFilters);        // 清除臨時篩選
    setTempPriceRange(defaultPriceRange);  // 清除臨時價格
    setSelectedFilters(defaultFilters);    // 清除實際篩選
    setFilterPriceRange(defaultPriceRange); // 清除實際價格
    setSortBy("default");
    setCurrentPage(1);
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
    const filteredProducts = getFilteredProducts();
    const sortedProducts = sortProducts(filteredProducts, sortBy);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  };


  const getFilteredProducts = () => {

    console.log("selectedFilters:", selectedFilters);
    console.log("filterPriceRange:", filterPriceRange);
    const filtered = products.filter(product => {
      const price = product.price || 0;
      const priceMatch = price >= filterPriceRange.min && price <= filterPriceRange.max;
      console.log(`\n检查商品: ${product.name} (ID: ${product.id})`);
      console.log(`  价格: ${price}, 范围: ${filterPriceRange.min}-${filterPriceRange.max}, 匹配: ${priceMatch}`);



      // 颜色篩選
      const productColor = colorMapping[product.colors];
      const colorMatch = !selectedFilters.colors?.length ||
        selectedFilters.colors.includes(productColor);
      console.log(`  颜色ID: ${product.colors}, 颜色名稱: ${productColor}, 篩選条件: [${selectedFilters.colors}], 匹配: ${colorMatch}`);


      // 材质篩選 - 通过 materials_id 映射到材质名稱
      const productMaterial = materialMapping[product.materials_id];
      const materialMatch = !selectedFilters.materials?.length ||
        selectedFilters.materials.includes(productMaterial);
      console.log(`  材質ID: ${product.materials_id}, 材質名稱: ${productMaterial}, 篩選条件: [${selectedFilters.materials}], 匹配: ${materialMatch}`);


      // 系列篩選 - 使用 style 字段
      const seriesMatch = !selectedFilters.series?.length ||
        selectedFilters.series.includes(product.style);

      console.log(`  系列: ${product.style}, 篩選条件: [${selectedFilters.series}], 匹配: ${seriesMatch}`);


      return priceMatch && colorMatch && materialMatch && seriesMatch;

    });
    console.log("筛选结果:", filtered.length, "个商品");
    console.log("商品列表:", filtered.map(p => p.name));

    return filtered;
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:3005/api/products";
        let allProducts = [];

        if (selectedSubCategory) {
          // 如果選擇了子分類，先按大分類獲取商品，再按名稱篩選
          const mainCategory = categoryMapping[selectedSubCategory];
          if (mainCategory) {
            const response = await fetch(`${url}?category=${encodeURIComponent(mainCategory)}`);
            const categoryProducts = await response.json();

            // 從中篩選包含子分類關鍵字的商品
            allProducts = categoryProducts.filter(product =>
              product.name.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
              product.description?.toLowerCase().includes(selectedSubCategory.toLowerCase())
            );
          }
        } else if (selectedCategory) {
          // 只選擇了大分類
          const response = await fetch(`${url}?category=${encodeURIComponent(selectedCategory)}`);
          allProducts = await response.json();
        } else {
          // 獲取所有商品
          const response = await fetch(url);
          allProducts = await response.json();
        }

        console.log('獲取的商品:', allProducts);
        setProducts(Array.isArray(allProducts) ? allProducts : []);
        setCurrentPage(1);
      } catch (err) {
        console.error("產品 API 請求錯誤：", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubCategory]);
  // //產品api
  // useEffect(() => {
  //   fetch("http://localhost:3005/api/products")
  //     .then((res) => res.json())
  //     .then((json) => {
  //       console.log(json);
  //       setProducts(Array.isArray(json) ? json : []);
  //     })
  //     .catch((err) => {
  //       console.error("產品 API 請求錯誤：", err);
  //     });
  // }, []);

  const currentProducts = getCurrentPageProducts();

  const handleCategoryClick = (e, categoryName) => {
    e.preventDefault();

    // 檢查是否為子分類
    if (categoryMapping[categoryName]) {
      // 這是子分類
      setSelectedSubCategory(categoryName);
      setSelectedCategory(categoryMapping[categoryName]);
    } else {
      // 這是大分類
      setSelectedCategory(categoryName);
      setSelectedSubCategory('');
    }

    // 清除其他篩選條件
    clearFilters();
  };


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
              aria-expanded="false"
            >
              空間<i className="fas fa-chevron-down fa-sm"></i>
            </div>
            <div className="dropdown-menu dropdown-megamenu">
              <div className="megamenu-column">
                <a href="#" className="dropdown-header" onClick={(e) => handleCategoryClick(e, '客廳')}>
                  客廳
                </a>                    <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '邊桌')}>
                  邊桌
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '單椅')}>
                  單椅/單人沙發
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '茶几')}>
                  茶几
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '書櫃')}>
                  書櫃 / 書架
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '書桌')}>
                  書桌 / 書桌椅
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '邊櫃')}>
                  邊櫃 / 收納櫃
                </a>
              </div>
              <div className="megamenu-column">
                <a href="#" className="dropdown-header" onClick={(e) => handleCategoryClick(e, '廚房')}>
                  廚房
                </a>                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '實木餐桌')}>
                  實木餐桌
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '餐椅')}>
                  餐椅 / 椅子
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '吧台桌')}>
                  吧台桌
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '吧台椅')}>
                  吧台椅
                </a>
              </div>
              <div className="megamenu-column">
                <a href="#" className="dropdown-header" onClick={(e) => handleCategoryClick(e, '臥室')}>
                  臥室
                </a>                    <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '床架')}>
                  床架
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '床邊桌')}>
                  床邊桌
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '化妝台')}>
                  化妝台
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '全身鏡')}>
                  全身鏡 / 鏡子
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '衣櫃')}>
                  衣櫃 / 衣架
                </a>
              </div>
              <div className="megamenu-column">
                <a href="#" className="dropdown-header" onClick={(e) => handleCategoryClick(e, '兒童房')}>
                  兒童房
                </a>                      <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '桌椅組')}>
                  桌椅組
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '衣櫃')}>
                  衣櫃
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '床架')}>
                  床架
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '收納櫃')}>
                  收納櫃
                </a>
              </div>
              <div className="megamenu-column">
                <a href="#" className="dropdown-header" onClick={(e) => handleCategoryClick(e, '收納用品')}>
                  收納空間
                </a>                    <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '收納盒')}>
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
      <div className="breadcrumb">
        <a href="/">首頁</a>
        <div className="arrow">&gt;</div>
        <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(''); setSelectedSubCategory(''); }}>
          商品總頁
        </a>
        {selectedCategory && (
          <>
            <div className="arrow">&gt;</div>
            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedSubCategory(''); }}>
              {selectedCategory}
            </a>
          </>
        )}
        {selectedSubCategory && (
          <>
            <div className="arrow">&gt;</div>
            {selectedSubCategory}
          </>
        )}
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

                {/* 顏色 */}
                <div className="filter-section">
                  <h3 className="filter-title">顏色</h3>
                  <div className="color-options">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        className={`color-option ${tempFilters?.colors?.includes(color.value) ? 'selected' : ''}`}
                        style={{
                          backgroundColor: color.color,
                        }}
                        onClick={() => handleColorFilter(color.value)}
                        title={color.name}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* 材質 */}
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

                {/* 系列 */}
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

              {/* 篩選按鈕 */}
              <div className="filter-buttons">
                <button className="filter-btn" onClick={applyFilters}>
                  <img src="img/lan/filter2.svg"></img>套用篩選
                </button>
                <button className="reset-btn" onClick={clearFilters}>清除</button>
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
