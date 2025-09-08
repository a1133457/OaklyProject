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
  const [currentTitle, setCurrentTitle] = useState('全部商品');
  const [currentHeroImage, setCurrentHeroImage] = useState('/img/lan/header.png');
  const [isWishlisted, setIsWishlisted] = useState({});
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wishlistQuantity, setWishlistQuantity] = useState(1);
  const [currentWishlistProduct, setCurrentWishlistProduct] = useState(null);
  const { addToCart } = useCart();
  const [showCartModal, setShowCartModal] = useState(false);
  const [currentCartProduct, setCurrentCartProduct] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(1);

  // 獲取最新商品
  const fetchLatestProducts = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/products/latest?limit=50');
      const products = await response.json();

      const productsWithNewFlag = products.map(product => ({
        ...product,
        isNew: true
      }));

      setProducts(productsWithNewFlag);
      setCurrentPage(1);

      // 設置頁面狀態為最新商品
      setCurrentTitle('最新商品');
      setCurrentHeroImage('/img/lan/new.jpg');
      setSelectedCategory('');
      setSelectedSubCategory('');
      clearFilters();

    } catch (error) {
      console.error('獲取最新商品失敗:', error);
    }
  };

  const handleCartClick = (product, e) => {
    e.stopPropagation();
    openCartModal(product);
  };

  const openCartModal = async (product) => {
    setCurrentCartProduct(product);
    setSelectedColor(product.colors?.[0] || null);
    setSelectedSize(product.sizes?.[0] || null);
    setCartQuantity(1);
    setShowCartModal(true);
    document.body.classList.add('no-scroll');

    // 如果需要獲取完整商品資料
    if (!product.colors || !product.sizes) {
      try {
        const response = await fetch(`http://localhost:3005/api/products/${product.id}`);
        const result = await response.json();
        if (result.status === 'success') {
          setCurrentCartProduct(result.data);
          setSelectedColor(result.data.colors?.[0] || null);
          setSelectedSize(result.data.sizes?.[0] || null);
        }
      } catch (err) {
        console.error('獲取商品詳細資料失敗:', err);
      }
    }
  };

  const addToCartFromModal = () => {
    if (!selectedColor || !selectedSize) {
      alert('請選擇顏色和尺寸');
      return;
    }

    addToCart(currentCartProduct, cartQuantity, selectedColor, selectedSize);
    setShowCartModal(false);
    document.body.classList.remove('no-scroll');
  };

  const getImageUrl = (product) => {
    if (!product || !product.images || product.images.length === 0) {
      return '/img/lan/placeholder.jpg';
    }

    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return `http://localhost:3005${firstImage}`;
    } else if (firstImage && firstImage.url) {
      return `http://localhost:3005${firstImage.url}`;
    }

    return '/img/lan/placeholder.jpeg';
  };

  // 新增分類資料映射
  const categoryData = {
    '': {
      title: '全部商品',
      image: '/img/lan/header.png'
    },
    '客廳': {
      title: '客廳',
      image: '/img/lan/livingroom.jpg'
    },
    '廚房': {
      title: '廚房',
      image: '/img/lan/kitchen.jpg'
    },
    '臥室': {
      title: '臥室',
      image: '/img/lan/bedroom.jpg'
    },
    '兒童房': {
      title: '兒童房',
      image: '/img/lan/child.jpg'
    },
    '收納用品': {
      title: '收納用品',
      image: '/img/lan/storage.jpg'
    }
  };

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
    '衣櫃': '兒童房',
    '收納櫃': '兒童房',
    // 收納用品分類
    '收納盒': '收納用品',
    '收納箱': '收納用品'
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

    // console.log("selectedFilters:", selectedFilters);
    // console.log("filterPriceRange:", filterPriceRange);
    const filtered = products.filter(product => {
      const price = product.price || 0;
      const priceMatch = price >= filterPriceRange.min && price <= filterPriceRange.max;
      // console.log(`\n检查商品: ${product.name} (ID: ${product.id})`);
      // console.log(`  价格: ${price}, 范围: ${filterPriceRange.min}-${filterPriceRange.max}, 匹配: ${priceMatch}`);


      const productColor = colorMapping[product.colors];
      const colorMatch = !selectedFilters.colors?.length ||
        selectedFilters.colors.includes(productColor);
      // console.log(`  颜色ID: ${product.colors}, 颜色名稱: ${productColor}, 篩選条件: [${selectedFilters.colors}], 匹配: ${colorMatch}`);


      const productMaterial = materialMapping[product.materials_id];
      const materialMatch = !selectedFilters.materials?.length ||
        selectedFilters.materials.includes(productMaterial);
      // console.log(`  材質ID: ${product.materials_id}, 材質名稱: ${productMaterial}, 篩選条件: [${selectedFilters.materials}], 匹配: ${materialMatch}`);


      const seriesMatch = !selectedFilters.series?.length ||
        selectedFilters.series.includes(product.style);

      // console.log(`  系列: ${product.style}, 篩選条件: [${selectedFilters.series}], 匹配: ${seriesMatch}`);


      return priceMatch && colorMatch && materialMatch && seriesMatch;

    });
    // console.log("筛选结果:", filtered.length, "个商品");
    // console.log("商品列表:", filtered.map(p => p.name));

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

        // console.log('獲取的商品:', allProducts);
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
      const mainCategory = categoryMapping[categoryName];
      setSelectedSubCategory(categoryName);
      setSelectedCategory(categoryMapping[categoryName]);
      setSelectedCategory(mainCategory);

      // 更新標題和背景圖片為主分類
      const categoryInfo = categoryData[mainCategory] || categoryData[''];
      setCurrentTitle(categoryInfo.title);
      setCurrentHeroImage(categoryInfo.image);

    } else {
      // 這是大分類
      setSelectedCategory(categoryName);
      setSelectedSubCategory('');

      // 更新標題和背景圖片
      const categoryInfo = categoryData[categoryName] || categoryData[''];
      setCurrentTitle(categoryInfo.title);
      setCurrentHeroImage(categoryInfo.image);

    }

    // 清除其他篩選條件
    clearFilters();
  };
  // 添加收藏相關函數
  const handleWishlistToggle = async (product, e) => {
    e.stopPropagation();
    e.preventDefault();

    console.log('handleWishlistToggle 被調用', product.id);
    console.log('isWishlisted 狀態:', isWishlisted[product.id]);

    if (isWishlisted[product.id]) {
      await removeFromWishlist(product.id);
    } else {
      openWishlistModal(product);
    }
  };

  const openWishlistModal = async (product) => {
    console.log('openWishlistModal 被調用', product);
    console.log('product.images:', product.images);
    setSelectedColor(product.colors?.[0] || null);
    setSelectedSize(product.sizes?.[0] || null);
    setWishlistQuantity(1);
    console.log('準備設置 showWishlistModal 為 true');

    setShowWishlistModal(true);
    document.body.classList.add('no-scroll');

    // 如果商品缺少詳細資料，獲取完整資料
    if (!product.colors || !product.sizes) {
      try {
        const response = await fetch(`http://localhost:3005/api/products/${product.id}`);
        const result = await response.json();
        if (result.status === 'success') {
          console.log('獲取到完整商品資料:', result.data);
          console.log('完整商品的圖片資料:', result.data.images);


          setCurrentWishlistProduct(result.data);
          setSelectedColor(result.data.colors?.[0] || null);
          setSelectedSize(result.data.sizes?.[0] || null);
        }
      } catch (err) {
        console.error('獲取商品詳細資料失敗:', err);
      }
    }
  };

  const addToWishlist = async () => {
    if (!selectedColor || !selectedSize) {
      alert('請選擇顏色和尺寸');
      return;
    }

    try {
      const userId = localStorage.getItem('userId') || 1;
      const wishlistData = {
        userId: userId,
        productId: currentWishlistProduct.id,
        colorId: selectedColor.id,
        sizeId: selectedSize.id,
        quantity: wishlistQuantity
      };

      const response = await fetch('http://localhost:3005/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(wishlistData)
      });

      const result = await response.json();
      if (result.status === 'success') {
        setIsWishlisted(prev => ({
          ...prev,
          [currentWishlistProduct.id]: true
        }));
        setShowWishlistModal(false);
        document.body.classList.remove('no-scroll');

        // 顯示成功通知
        const notification = document.createElement('div');
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #9FA79A;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-size: 14px;
      `;
        notification.textContent = '已加入收藏';
        document.body.appendChild(notification);

        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      }
    } catch (err) {
      console.error('加入收藏失敗:', err);
      alert('加入收藏時發生錯誤');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem('userId') || 1;
      const response = await fetch(`http://localhost:3005/api/wishlist/${userId}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      if (result.status === 'success') {
        setIsWishlisted(prev => ({
          ...prev,
          [productId]: false
        }));
      }
    } catch (err) {
      console.error('移除收藏失敗:', err);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();

    const defaultColor = product.colors?.[0] || null;
    const defaultSize = product.sizes?.[0] || null;

    addToCart(product, 1, defaultColor, defaultSize);
  };

  const getColorCode = (colorName) => {
    const colorMap = {
      '白色': '#ffffff',
      '黑色': '#000000',
      '原木色': '#deb887',
      '淺灰': '#d3d3d3',
      '深灰': '#555555',
      '淺藍': '#add8e6',
      '深藍': '#000080',
      '淺綠': '#90ee90',
      '深綠': '#006400',
      '米黃色': '#f5f5dc'
    };
    return colorMap[colorName] || '#cccccc';
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
        <div className="all-0">{currentTitle}</div>
        <div className="all-1">Oakly 質感家具，打造理想生活空間</div>
        <div className="all-2">
          精選每一件家具，只為帶來溫潤木質與極簡設計的完美結合。從客廳到臥室，Oakly
          讓家的每個角落都充滿溫度與品味。立即探索，找尋屬於你的生活風格。
        </div>
      </div>
      {/* Hero 區域 */}
      <section className="hero">
        <img src={currentHeroImage} alt="hero" />
        <div className="hero-content">
          <h1 className="hero-title">{currentTitle}</h1>

        </div>
      </section>
      <div className="sub-nav">
        <div className="sub-nav-links">
          <a href="#" className="sub-nav-link"
            onClick={(e) => {
              e.preventDefault();
              fetchLatestProducts();
            }}>
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
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '床架')}>
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
                  收納用品
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => handleCategoryClick(e, '收納盒')}>
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

            <a href="/" onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('');
              setSelectedSubCategory('');
              setCurrentTitle('全部商品');
              setCurrentHeroImage('/img/lan/header.png');
              
            }}>
              首頁
            </a>
            <div className="arrow">&gt;</div>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('');
              setSelectedSubCategory('');
              setCurrentTitle('全部商品');
              setCurrentHeroImage('/img/lan/header.png');
            }}>
              商品總頁
            </a>
            {selectedCategory && (
              <>
                <div className="arrow">&gt;</div>
                <span>{selectedCategory}</span>
              </>
            )}
            {selectedSubCategory && (
              <>
                <div className="arrow">&gt;</div>
                <span>{selectedSubCategory}</span>
              </>
            )}
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

              <div className={`products-grid ${viewMode}`} key={viewMode}>
                {currentProducts.map((product) => (
                  <div key={product.id}
                    className="productcard"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}>
                    {product.isNew && <span className="badge-new">新品</span>}
                    <div className="image">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={getImageUrl(product)}
                          alt={product.name}
                          style={{ maxWidth: "200px", }}
                          onError={(e) => {
                            console.log('圖片載入失敗:', e.target.src);
                            e.target.src = '/img/lan/placeholder.jpeg';
                          }}
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          <span>暫無圖片</span>
                        </div>

                      )}
                    </div>

                    <div className="info" onClick={() => handleProductClick(product.id)}>
                      <h3 className="name">{product.name}</h3>
                      <p className="price">NT$ {product.price}</p>
                    </div>

                    {/* 操作按鈕區域 */}
                    <div className="product-actions">
                      <button
                        className="action-btn add-to-cart"
                        onClick={(e) => handleCartClick(product, e)}
                      >
                        加入購物車
                      </button>
                    </div>

                    {/* 右上角愛心按鈕 */}
                    <button
                      className={`wishlist-heart-btn ${isWishlisted[product.id] ? 'active' : ''}`}
                      onClick={(e) => {
                        handleWishlistToggle(product, e);
                      }}
                    >
                      <i className={`fa-${isWishlisted[product.id] ? 'solid' : 'regular'} fa-heart`}></i>
                    </button>
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
              {/* 收藏選擇彈窗 */}
              {showWishlistModal && (
                <>
                  <div
                    className="wishlist-modal-backdrop"
                    onClick={() => {
                      setShowWishlistModal(false);
                      document.body.classList.remove('no-scroll');
                    }}
                  ></div>

                  <div className="wishlist-modal-container">
                    <div className="wishlist-modal-content">
                      <button
                        className="wishlist-modal-close"
                        onClick={() => {
                          setShowWishlistModal(false);
                          document.body.classList.remove('no-scroll');
                        }}
                      >
                        ✕
                      </button>

                      <div className="wishlist-modal-header">
                        <h5 className="wishlist-modal-title">加入收藏清單</h5>
                      </div>

                      <div className="wishlist-modal-body">
                        <div className="wishlist-product-image">
                          <img
                            src={getImageUrl(currentWishlistProduct)}
                            alt={currentWishlistProduct?.name || ''}
                            onError={(e) => {
                              console.log('彈窗圖片載入失敗:', e.target.src);
                              e.target.src = '/img/lan/placeholder.jpeg';
                            }}
                          />
                        </div>
                        <div className="wishlist-form-content">
                          <h6 className="wishlist-product-name">{currentWishlistProduct?.name}</h6>
                          <p className="wishlist-product-price">NT$ {currentWishlistProduct?.price?.toLocaleString()}</p>

                          {/* 顏色選擇 */}
                          <div className="wishlist-form-group">
                            <label className="wishlist-form-label">選擇顏色</label>
                            <div className="wishlist-options">
                              {Array.isArray(currentWishlistProduct?.colors) && currentWishlistProduct.colors.map((color) => (
                                <div
                                  key={color.id}
                                  onClick={() => setSelectedColor(color)}
                                  className={`wishlist-color-option ${selectedColor?.id === color.id ? 'selected' : ''}`}
                                >
                                  <div
                                    className="wishlist-color-dot"
                                    style={{ backgroundColor: getColorCode(color.color_name) }}
                                  ></div>
                                  <span>{color.color_name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 尺寸選擇 */}
                          <div className="wishlist-form-group">
                            <label className="wishlist-form-label">選擇尺寸</label>
                            <div className="wishlist-options">
                              {Array.isArray(currentWishlistProduct?.sizes) && currentWishlistProduct.sizes.map((size) => (
                                <div
                                  key={size.id}
                                  onClick={() => setSelectedSize(size)}
                                  className={`wishlist-size-option ${selectedSize?.id === size.id ? 'selected' : ''}`}
                                >
                                  {size.size_label}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* 數量選擇 */}
                          <div className="wishlist-form-group">
                            <label className="wishlist-form-label">數量</label>
                            <div className="wishlist-quantity-controls">
                              <button
                                onClick={() => setWishlistQuantity(Math.max(1, wishlistQuantity - 1))}
                                disabled={wishlistQuantity <= 1}
                                className="wishlist-quantity-btn"
                              >
                                -
                              </button>
                              <span className="wishlist-quantity-display">{wishlistQuantity}</span>
                              <button
                                onClick={() => setWishlistQuantity(wishlistQuantity + 1)}
                                className="wishlist-quantity-btn"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="wishlist-modal-footer">
                            <button
                              onClick={addToWishlist}
                              disabled={!selectedColor || !selectedSize}
                              className="wishlist-submit-btn"
                            >
                              加入收藏
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 購物車選擇彈窗 */}
              {showCartModal && (
                <>
                  <div
                    className="cart-modal-backdrop"
                    onClick={() => {
                      setShowCartModal(false);
                      document.body.classList.remove('no-scroll');
                    }}
                  ></div>

                  <div className="cart-modal-container">
                    <div className="cart-modal-content">
                      <button
                        className="cart-modal-close"
                        onClick={() => {
                          setShowCartModal(false);
                          document.body.classList.remove('no-scroll');
                        }}
                      >
                        ✕
                      </button>

                      <div className="cart-modal-header">
                        <h5 className="cart-modal-title">加入購物車</h5>
                      </div>

                      <div className="cart-modal-body">
                        <div className="cart-product-image">
                          <img
                            src={getImageUrl(currentCartProduct)}
                            alt={currentCartProduct?.name || ''}
                            onError={(e) => {
                              console.log('彈窗圖片載入失敗:', e.target.src);
                              e.target.src = '/img/lan/placeholder.jpeg';
                            }}
                          />
                        </div>
                        <div className="cart-form-content">
                          <h6 className="cart-product-name">{currentCartProduct?.name}</h6>
                          <p className="cart-product-price">NT$ {currentCartProduct?.price?.toLocaleString()}</p>

                          {/* 顏色選擇 */}
                          <div className="cart-form-group">
                            <label className="cart-form-label">選擇顏色</label>
                            <div className="cart-options">
                              {Array.isArray(currentCartProduct?.colors) && currentCartProduct.colors.map((color) => (
                                <div
                                  key={color.id}
                                  onClick={() => setSelectedColor(color)}
                                  className={`cart-color-option ${selectedColor?.id === color.id ? 'selected' : ''}`}
                                >
                                  <div
                                    className="cart-color-dot"
                                    style={{ backgroundColor: getColorCode(color.color_name) }}
                                  ></div>
                                  <span>{color.color_name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 尺寸選擇 */}
                          <div className="cart-form-group">
                            <label className="cart-form-label">選擇尺寸</label>
                            <div className="cart-options">
                              {Array.isArray(currentCartProduct?.sizes) && currentCartProduct.sizes.map((size) => (
                                <div
                                  key={size.id}
                                  onClick={() => setSelectedSize(size)}
                                  className={`cart-size-option ${selectedSize?.id === size.id ? 'selected' : ''}`}
                                >
                                  {size.size_label}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 數量選擇 */}
                          <div className="cart-form-group">
                            <label className="cart-form-label">數量</label>
                            <div className="cart-quantity-controls">
                              <button
                                onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                                disabled={cartQuantity <= 1}
                                className="cart-quantity-btn"
                              >
                                -
                              </button>
                              <span className="cart-quantity-display">{cartQuantity}</span>
                              <button
                                onClick={() => setCartQuantity(cartQuantity + 1)}
                                className="cart-quantity-btn"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="cart-modal-footer">
                            <button
                              onClick={addToCartFromModal}
                              disabled={!selectedColor || !selectedSize}
                              className="cart-submit-btn"
                            >
                              加入購物車
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MainProduct;
