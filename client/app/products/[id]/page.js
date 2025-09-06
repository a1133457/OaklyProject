"use client";

import React, { useState, useEffect } from "react";
import "@/styles/products/pid.css";
import SimilarProducts from "@/app/_components/SimilarProducts.js";
import RecentViewedProducts from "@/app/_components/RecentViewedProducts.js";
import RandomShowcaseSection from "@/app/_components/RandomShowcaseSection.js";
import { useCart } from '@/app/contexts/CartContext.js';
import CategoryDropdown from '@/app/_components/CategoryDropdown.js';

// 跟隨指針移動的滾動條類別
class CustomThumbnailScrollbar {
  constructor(onImageChange) {
    this.isDragging = false;
    this.startX = 0;
    this.startScrollLeft = 0;
    this.startThumbLeft = 0;
    this.onImageChange = onImageChange;
    this.lastImageIndex = -1;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupScrollbar());
    } else {
      this.setupScrollbar();
    }
  }

  setupScrollbar() {
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    if (!thumbnailContainer) return;

    const thumbnails = thumbnailContainer.querySelectorAll('.thumbnail');
    if (thumbnails.length <= 1) return;

    this.thumbnails = Array.from(thumbnails);
    this.thumbnailContainer = thumbnailContainer;

    const existingScrollbar = document.querySelector('.custom-scrollbar-container');
    if (existingScrollbar) {
      existingScrollbar.remove();
    }

    const scrollbarContainer = this.createScrollbarContainer();
    thumbnailContainer.parentNode.insertBefore(scrollbarContainer, thumbnailContainer);
    thumbnailContainer.style.marginTop = '10px';

    this.setupScrollEvents(thumbnailContainer, scrollbarContainer);
    this.updateScrollbar(thumbnailContainer, scrollbarContainer);
  }

  createScrollbarContainer() {
    const container = document.createElement('div');
    container.className = 'custom-scrollbar-container';
    container.style.cssText = `
      position: relative;
      width: 500px;
      max-width: 500px;
      height: 8px;
      margin-bottom: 6px;
    `;

    const track = document.createElement('div');
    track.className = 'custom-scrollbar-track';
    track.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #f1f1f1;
      border-radius: 2px;
      z-index: 10;
    `;

    const thumb = document.createElement('div');
    thumb.className = 'custom-scrollbar-thumb';
    thumb.style.cssText = `
      position: absolute;
      top: 0;
      height: 4px;
      background: #666;
      border-radius: 2px;
      cursor: pointer;
      z-index: 11;
      min-width: 30px;
      max-width: 50px;
    `;

    container.appendChild(track);
    container.appendChild(thumb);

    return container;
  }

  calculateImageIndex(scrollLeft, scrollWidth, clientWidth) {
    if (!this.thumbnails || this.thumbnails.length === 0) return 0;

    const maxScrollLeft = scrollWidth - clientWidth;
    if (maxScrollLeft <= 0) return 0;

    const scrollPercentage = scrollLeft / maxScrollLeft;
    const imageIndex = Math.round(scrollPercentage * (this.thumbnails.length - 1));

    return Math.max(0, Math.min(imageIndex, this.thumbnails.length - 1));
  }

  setupScrollEvents(container, scrollbarContainer) {
    const thumb = scrollbarContainer.querySelector('.custom-scrollbar-thumb');
    const track = scrollbarContainer.querySelector('.custom-scrollbar-track');

    // 只在非拖拽時更新滾動條
    container.addEventListener('scroll', () => {
      if (!this.isDragging) {
        this.updateScrollbar(container, scrollbarContainer);

        const imageIndex = this.calculateImageIndex(
          container.scrollLeft,
          container.scrollWidth,
          container.clientWidth
        );

        if (imageIndex !== this.lastImageIndex && this.onImageChange) {
          this.onImageChange(imageIndex);
          this.lastImageIndex = imageIndex;
        }
      }
    });

    this.setupDragEvents(container, thumb, track);

    track.addEventListener('click', (e) => {
      this.handleTrackClick(e, container, thumb, track);
    });
  }

  updateScrollbar(container, scrollbarContainer) {
    const thumb = scrollbarContainer.querySelector('.custom-scrollbar-thumb');
    const track = scrollbarContainer.querySelector('.custom-scrollbar-track');

    if (!thumb || !track) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    if (scrollWidth <= clientWidth) {
      scrollbarContainer.style.display = 'none';
      return;
    } else {
      scrollbarContainer.style.display = 'block';
    }

    const trackWidth = track.offsetWidth;
    const thumbWidth = Math.max(30, Math.min(50, trackWidth / this.thumbnails.length * 2));

    const maxThumbPosition = trackWidth - thumbWidth;
    const scrollRatio = scrollLeft / (scrollWidth - clientWidth);
    const thumbPosition = scrollRatio * maxThumbPosition;

    thumb.style.width = thumbWidth + 'px';
    thumb.style.left = Math.max(0, Math.min(thumbPosition, maxThumbPosition)) + 'px';
  }

  setupDragEvents(container, thumb, track) {
    let initialOffset = 0;

    const handleMouseDown = (e) => {
      this.isDragging = true;
      
      // 記錄滑鼠點擊滑塊時的偏移量
      const thumbRect = thumb.getBoundingClientRect();
      initialOffset = e.clientX - thumbRect.left;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      e.preventDefault();
      thumb.classList.add('dragging');
      thumb.style.background = '#333';
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
      if (!this.isDragging) return;

      // 直接計算滑塊位置，完全跟隨滑鼠
      const trackRect = track.getBoundingClientRect();
      const thumbWidth = thumb.offsetWidth;
      const trackWidth = trackRect.width;
      
      // 滑鼠在軌道中的位置減去初始偏移
      const mouseX = e.clientX;
      const trackLeft = trackRect.left;
      const newThumbLeft = mouseX - trackLeft - initialOffset;
      
      // 限制範圍
      const maxThumbLeft = trackWidth - thumbWidth;
      const clampedLeft = Math.max(0, Math.min(newThumbLeft, maxThumbLeft));
      
      // 立即設置滑塊位置 - 這應該是瞬間的
      thumb.style.left = clampedLeft + 'px';
      
      // 計算滾動位置
      const ratio = maxThumbLeft > 0 ? clampedLeft / maxThumbLeft : 0;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newScrollLeft = ratio * maxScroll;
      
      // 設置滾動位置
      container.scrollLeft = newScrollLeft;

      // 更新圖片
      const imageIndex = this.calculateImageIndex(newScrollLeft, container.scrollWidth, container.clientWidth);
      if (imageIndex !== this.lastImageIndex && this.onImageChange) {
        this.onImageChange(imageIndex);
        this.lastImageIndex = imageIndex;
      }
    };

    const handleMouseUp = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      thumb.classList.remove('dragging');
      thumb.style.background = '#666';
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    thumb.addEventListener('mousedown', handleMouseDown);
    thumb.addEventListener('dragstart', (e) => e.preventDefault());

    thumb.addEventListener('mouseenter', () => {
      if (!this.isDragging) {
        thumb.style.background = '#555';
        document.body.style.cursor = 'grab';
      }
    });

    thumb.addEventListener('mouseleave', () => {
      if (!this.isDragging) {
        thumb.style.background = '#666';
        document.body.style.cursor = '';
      }
    });
  }

  handleTrackClick(e, container, thumb, track) {
    if (e.target === thumb) return;

    const trackRect = track.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const trackWidth = track.offsetWidth;
    const thumbWidth = thumb.offsetWidth;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // 點擊軌道時，讓滑塊中心移動到點擊位置
    const targetThumbCenter = clickX;
    const targetThumbLeft = targetThumbCenter - (thumbWidth / 2);
    const maxThumbPosition = trackWidth - thumbWidth;
    const clampedThumbLeft = Math.max(0, Math.min(targetThumbLeft, maxThumbPosition));
    
    const clickRatio = maxThumbPosition > 0 ? clampedThumbLeft / maxThumbPosition : 0;
    const maxScrollLeft = scrollWidth - clientWidth;
    const targetScrollLeft = clickRatio * maxScrollLeft;

    container.scrollTo({
      left: Math.max(0, Math.min(targetScrollLeft, maxScrollLeft)),
      behavior: 'smooth'
    });
  }

  scrollToImage(imageIndex) {
    if (!this.thumbnailContainer || !this.thumbnails) return;

    const scrollWidth = this.thumbnailContainer.scrollWidth;
    const clientWidth = this.thumbnailContainer.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;

    const scrollRatio = imageIndex / (this.thumbnails.length - 1);
    const targetScrollLeft = scrollRatio * maxScrollLeft;

    this.thumbnailContainer.scrollTo({
      left: Math.max(0, Math.min(targetScrollLeft, maxScrollLeft)),
      behavior: 'smooth'
    });

    this.lastImageIndex = imageIndex;
  }
}


export default function PidPage({ params }) {
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
      '米黃色': '#f5f5dc',
      // 英文顏色名稱
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'blue': '#0000ff',
      'green': '#008000',
      'yellow': '#ffff00',
      'orange': '#ffa500',
      'purple': '#800080',
      'pink': '#ffc0cb',
      'brown': '#a52a2a',
      'gray': '#808080',
      'grey': '#808080'
    };

    if (!colorName) return '#cccccc';
    return colorMap[colorName] || '#cccccc';
  };
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wishlistQuantity, setWishlistQuantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [currentWishlistProduct, setCurrentWishlistProduct] = useState(null);




  // 展開狀態管理
  const [expandedSections, setExpandedSections] = useState({
    productInfo: false,
    designer: false,
    materials: false,
    sizes: false,
    stock: false
  });

  // 從 URL 參數獲取產品 ID
  const resolvedParams = React.use(params);
  const productId = resolvedParams?.id || 1;

  // 獲取產品資料
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3005/api/products/${productId}`);
        const result = await response.json();

        if (result.status === 'success') {
          setProductData(result.data);
          // 設置默認選項
          if (result.data.colors && result.data.colors.length > 0) {
            setSelectedColor(result.data.colors[0]);
          }
          if (result.data.sizes && result.data.sizes.length > 0) {
            setSelectedSize(result.data.sizes[0]);
          }
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('獲取產品資料時發生錯誤');
        console.error('Error fetching product data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);


  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const userId = localStorage.getItem('userId') || 1;
        const response = await fetch(`http://localhost:3005/api/wishlist/check/${userId}/${productId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        // 檢查是否返回 JSON
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
          console.warn('Wishlist API not available yet');
          return;
        }

        const result = await response.json();
        if (result.status === 'success') {
          setIsWishlisted(result.data.isWishlisted);
        }
      } catch (err) {
        console.error('Error checking wishlist status:', err);
        // 靜默處理，不影響頁面運行
      }
    };

    if (productId) {
      checkWishlistStatus();
    }
  }, [productId]);

  useEffect(() => {
    if (!showWishlistModal) {
      document.body.classList.remove('no-scroll');
    }
  }, [showWishlistModal]);

  // 加入/移除收藏的處理函數
  const handleWishlistClick = (targetProduct = null, event = null) => {
    const product = targetProduct || productData;

    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      openWishlistModal(product, event);
    }
  };

  const handleWishlistToggle = (product, e) => {
    e.stopPropagation();
    handleWishlistClick(product);
  };

  const openWishlistModal = async (product, clickEvent = null) => {
    setCurrentWishlistProduct(product);
    setSelectedColor(product.colors?.[0] || null);
    setSelectedSize(product.sizes?.[0] || null);
    setWishlistQuantity(1);
    setShowWishlistModal(true);
    document.body.classList.add('no-scroll');

    // 如果是其他商品且缺少詳細資料，先獲取完整資料
    if (product.id !== parseInt(productId) && (!product.colors || !product.sizes)) {
      try {
        setWishlistLoading(true);
        const response = await fetch(`http://localhost:3005/api/products/${product.id}`);
        const result = await response.json();

        if (result.status === 'success') {
          product = result.data;
          setCurrentWishlistProduct(result.data);
          setSelectedColor(result.data.colors?.[0] || null);
          setSelectedSize(result.data.sizes?.[0] || null);
        }
      } catch (err) {
        console.error('獲取商品詳細資料失敗:', err);
        alert('無法載入商品資料，請稍後再試');
        return;
      } finally {
        setWishlistLoading(false);
      }
    }


  };


  useEffect(() => {
    if (showWishlistModal) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }
    return () => document.body.classList.remove('body-no-scroll');
  }, [showWishlistModal]);

  useEffect(() => {
    let thumbnailScrollbar;

    // 延遲執行以確保 DOM 元素已渲染
    const timer = setTimeout(() => {
      // 傳入回調函數來處理圖片切換
      thumbnailScrollbar = new CustomThumbnailScrollbar((imageIndex) => {
        setSelectedImage(imageIndex);
      });
    }, 100);

    // 清理函數
    return () => {
      clearTimeout(timer);
      const customScrollbars = document.querySelectorAll('.custom-scrollbar-container');
      customScrollbars.forEach(el => el.remove());
    };
  }, [productData]);


  const isProductInWishlist = (targetProductId) => {
    if (targetProductId === parseInt(productId)) {
      return isWishlisted;
    }
    return false; // 需要根據你的全域狀態管理來實現
  };

  //加入收藏API
  const addToWishlist = async () => {
    if (!selectedColor || !selectedSize) {
      alert('請選擇顏色和尺寸');
      return;
    }

    const product = currentWishlistProduct || productData;

    try {
      setWishlistLoading(true);
      const userId = localStorage.getItem('userId') || 1;
      const wishlistData = {
        userId: userId,
        productId: product.id,
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

      // 檢查響應格式
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('API 端點不存在或未正確設置');
      }

      const result = await response.json();

      if (result.status === 'success') {
        if (product.id === parseInt(productId)) {
          setIsWishlisted(true);
        }
        setIsWishlisted(true);
        setShowWishlistModal(false);
        document.body.classList.remove('no-scroll');
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

      } else {
        alert(result.message || '加入收藏失敗');
      }
    } catch (err) {
      console.error('發生錯誤:', err);
      alert('加入收藏時發生錯誤');
    } finally {
      setWishlistLoading(false);
    }
  };

  // 移除收藏API
  const removeFromWishlist = async (targetProductId = null) => {
    const productIdToRemove = targetProductId || productId;

    try {
      setWishlistLoading(true);
      const userId = localStorage.getItem('userId') || 1;

      const response = await fetch(`http://localhost:3005/api/wishlist/${userId}/${productIdToRemove}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.status === 'success') {
        setIsWishlisted(false);
        alert('已從收藏清單移除');
      } else {
        alert(result.message || '移除收藏失敗');
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('移除收藏時發生錯誤');
    } finally {
      setWishlistLoading(false);
    }
  };

  // 切換展開狀態
  const toggleExpanded = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));

  };


  // 展開圖示組件
  const ExpandIcon = ({ isExpanded }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease'
      }}
    >
      <path
        d="M13 5.5H8.5V1C8.5 0.447812 8.05219 0 7.5 0H6.5C5.94781 0 5.5 0.447812 5.5 1V5.5H1C0.447812 5.5 0 5.94781 0 6.5V7.5C0 8.05219 0.447812 8.5 1 8.5H5.5V13C5.5 13.5522 5.94781 14 6.5 14H7.5C8.05219 14 8.5 13.5522 8.5 13V8.5H13C13.5522 8.5 14 8.05219 14 7.5V6.5C14 5.94781 13.5522 5.5 13 5.5Z"
        fill="#6A6A6A"
      />
    </svg>
  );

  // 展開內容組件
  const ExpandedContent = ({ section, isExpanded, children }) => (
    <div
      className={`expanded-content ${isExpanded ? 'expanded' : ''}`}
      style={{
        maxHeight: isExpanded ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',

      }}
    >
      <div style={{
        'paddingBottom': isExpanded ? '8px' : '0 px',
        width: "100%"
      }}>
        {children}
      </div>
    </div>
  );



  if (error) {
    return (
      <div className="detail-product-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p style={{ color: '#dc2626' }}>錯誤: {error}</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="detail-product-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>找不到產品資料</p>
        </div>
      </div>
    );
  }

  const processImages = (images) => {
    if (!images || images.length === 0) {
      // 沒有圖片時的預設圖片
      return ["https://via.placeholder.com/500x400/f0f0f0/666?text=No+Image"];
    }

    return images.map(img => {
      // 如果是物件格式 { id: 1, url: "/uploads/pic.jpg" }
      if (typeof img === 'object' && img.url) {
        return img.url.startsWith('http')
          ? img.url
          : `http://localhost:3005${img.url}`;
      }

      // 如果是字串格式 "/uploads/pic.jpg"
      if (typeof img === 'string') {
        return img.startsWith('http')
          ? img
          : `http://localhost:3005${img}`;
      }

      // 如果都不是，返回錯誤圖片
      return "https://via.placeholder.com/500x400/ff0000/ffffff?text=Error";
    });
  };

  // 處理圖片
  const displayImages = processImages(productData.images);
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const imageUrl = typeof product.images[0] === 'string'
        ? product.images[0]
        : product.images[0].url;

      return imageUrl.startsWith('http')
        ? imageUrl
        : `http://localhost:3005${imageUrl}`;
    }
    return `https://via.placeholder.com/300x200/f0f0f0/666?text=${encodeURIComponent(product.name)}`;
  };


  return (
    <div className="detail-product-page">
      {/* 麵包屑導航 */}
      <div className="sub-nav">
        <div className="sub-nav-links">
          <a href="#" className="sub-nav-link">
            最新商品
          </a>
          <a href="#" className="sub-nav-link">
            熱賣
          </a>
          <CategoryDropdown />

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
            <div className="arrow-name">&gt;</div>
            {productData.name}
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="pid-container">
        <div className="product-detail-wrapper">
          {/* 左側商品圖片 */}
          <div className="product-images">
            <div className="main-image">
              <img src={displayImages[selectedImage]} alt={productData.name} />
            </div>
            <div className="thumbnail-images">
              {displayImages.map((image, index) => (
                <div

                  key={index}
                  className={`thumbnail ${selectedImage === index ? "active" : ""
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${productData.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* 右側商品資訊 */}
          <div className="pid-info">
            <div className="pid-name">{productData.name}</div>
            <div className="express">
              {productData.category_name || '邊桌'}, {productData.colors?.[0]?.color_name || '白色'}, {productData.sizes?.[0]?.size_label || '71x50 公分'}
            </div>
            <div className="product-price">NT$ {productData.price?.toLocaleString()}</div>

            <div className="rating">
              <div className="rating-icon-container">
                <div className="rating-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="rating-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="rating-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="rating-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="rating-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <span className="rating-text">4.8</span>
              </div>

              <button
                type="button"
                className="btn view-review"
                onClick={() => {
                  setShowModal(true);
                  document.body.classList.add('modal-open');

                }}
              >
                查看評論
              </button>
              <div
                className={`modal fade ${showModal ? 'show' : ''}`}

                onWheel={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden={!showModal}
                style={{
                  display: showModal ? 'block' : 'none',
                }}

              >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        評論內容
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setShowModal(false);
                          document.body.style.position = '';
                          document.body.style.width = '';
                          document.body.style.overflow = '';
                        }}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div
                      className="modal-body"
                      style={{ height: "80vh", padding: 0 }}
                    >
                      <iframe
                        src="/review"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: "none" }}
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>

              {showModal && (
                <div
                  className="modal-backdrop fade show"
                  onClick={() => {
                    setShowModal(false);
                    document.body.style.position = '';
                    document.body.style.width = '';
                    document.body.style.overflow = '';
                  }}
                ></div>
              )}
            </div>

            <div className="product-description">
              {productData.description || "為你的生活角落增添一抹實用美感，這款北歐風簡約邊桌，採用實木材質與霧面烤漆，適合擺放於沙發側、床邊或閱讀角落。不僅能放置咖啡杯、書籍或燈具，極簡設計也能輕鬆融入各種空間風格。"}
            </div>

            <div className="product-specs">
              <div className="spec-item">
                <div className="spec-label">顏色：</div>
                <div className="colors">
                  {productData.colors?.map((color) => (
                    <div
                      key={color.id}
                      className={`color ${selectedColor?.id === color.id ? 'selected' : ''}`}
                      style={{ backgroundColor: getColorCode(color.color_name) }}
                      title={color.color_name}
                      onClick={() => setSelectedColor(color)} // 添加點擊事件
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="quantity-selector">
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <div className="quantity-number">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <div className="saved">
                <div
                  className={`saved-icon ${isWishlisted ? 'wishlisted' : ''}`}
                  onClick={(e) => handleWishlistClick(null, e)}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`}></i>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="buy-now-btn">立即購買</button>
              <button
                className="add-to-cart-btn"
                onClick={() => {
                  console.log('商品資料：', productData);
                  addToCart(productData, quantity, selectedColor, selectedSize);
                }}
              >加入購物車</button>
            </div>

            {/* 更新的資訊展開區塊 */}
            <div className="more-info">
              {/* 產品資訊 */}

              <div
                className="more-info-item-text"
                onClick={() => toggleExpanded('productInfo')}
                style={{ cursor: 'pointer' }}
              >
                產品資訊
                <ExpandIcon isExpanded={expandedSections.productInfo} />
              </div>
              <ExpandedContent section="productInfo" isExpanded={expandedSections.productInfo}>
                {productData.description}
                <br></br>
                <strong>產品編號：</strong>{productData.id}

              </ExpandedContent>


              {/* 設計師 */}
              <div
                className="more-info-item-text"
                onClick={() => toggleExpanded('designer')}
                style={{ cursor: 'pointer' }}
              >
                設計師
                <ExpandIcon isExpanded={expandedSections.designer} />
              </div>
              <ExpandedContent section="designer" isExpanded={expandedSections.designer}>
                <div>
                  {productData.designer_name || '未指定設計師'}
                </div>
              </ExpandedContent>

              {/* 材質 */}
              <div
                className="more-info-item-text"
                onClick={() => toggleExpanded('materials')}
                style={{ cursor: 'pointer' }}
              >
                材質
                <ExpandIcon isExpanded={expandedSections.materials} />
              </div>
              <ExpandedContent section="materials" isExpanded={expandedSections.materials}>
                <div>
                  {productData.materials?.length > 0 ? (
                    <div>
                      {productData.materials.map((material, index) => (
                        <div key={material.id} >
                          {material.material_name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>高級布料、實木材質</div>
                  )}
                </div>
              </ExpandedContent>

              {/* 尺寸 */}
              <div
                className="more-info-item-text"
                onClick={() => toggleExpanded('sizes')}
                style={{ cursor: 'pointer' }}
              >
                尺寸
                <ExpandIcon isExpanded={expandedSections.sizes} />
              </div>
              <ExpandedContent section="sizes" isExpanded={expandedSections.sizes}>
                <div>
                  {productData.sizes?.length > 0 ? (
                    <div>
                      {productData.sizes.map((size) => (
                        <div key={size.id} >
                          {size.size_label}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>77X44 公分</div>
                  )}
                </div>
              </ExpandedContent>

              {/* 庫存 */}
              <div
                className="more-info-item-text"
                onClick={() => toggleExpanded('stock')}
                style={{ cursor: 'pointer' }}
              >
                庫存 ({productData.stock?.total || 0})
                <ExpandIcon isExpanded={expandedSections.stock} />
              </div>
              <ExpandedContent section="stock" isExpanded={expandedSections.stock}>
                <div>
                  {productData.stock?.details?.length > 0 ? (
                    <div>
                      <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>
                        總庫存：{productData.stock.total} 件
                      </div>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {productData.stock.details.map((stock, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '14px'
                          }}>
                            <span>
                              {stock.color_name} - {stock.size_label}
                            </span>
                            <span style={{
                              fontWeight: 'bold'
                            }}>
                              {stock.amount} 件
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6A6A6A' }}>目前無庫存資訊</div>
                  )}
                </div>
              </ExpandedContent>
            </div>
          </div>
        </div>

        <SimilarProducts currentProductId={parseInt(productId)}
          handleWishlistToggle={handleWishlistToggle}
          isProductInWishlist={isProductInWishlist} />


        <RandomShowcaseSection />


        <SimilarProducts currentProductId={parseInt(productId)}
          handleWishlistToggle={handleWishlistToggle}
          isProductInWishlist={isProductInWishlist} />

        <RecentViewedProducts
          className="middle-content"
          currentProductId={productId}
          maxItems={8}
        />
      </div>

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
                    src={currentWishlistProduct ?
                      getProductImage(currentWishlistProduct) :
                      displayImages[selectedImage]
                    }
                    alt={(currentWishlistProduct || productData).name}
                  />
                </div>
                <div className="wishlist-form-content">
                  <h6 className="wishlist-product-name">{(currentWishlistProduct || productData).name}</h6>
                  <p className="wishlist-product-price">NT$ {(currentWishlistProduct || productData).price?.toLocaleString()}</p>

                  {/* 顏色選擇 */}
                  <div className="wishlist-form-group">
                    <label className="wishlist-form-label">選擇顏色</label>
                    <div className="wishlist-options">
                      {Array.isArray((currentWishlistProduct || productData)?.colors) && (currentWishlistProduct || productData).colors.map((color) => (
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
                      {Array.isArray((currentWishlistProduct || productData)?.sizes) && (currentWishlistProduct || productData).sizes.map((size) => (
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
                      <span className="wishlist-quantity-display">
                        {wishlistQuantity}
                      </span>
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

      <div className="end-content">
        <img src="/img/lan/clean.jpg" alt="clean" />
        <div className="end-content-text">
          <div className="end-content-text-title-container">
            <div className="end-content-text-title">讓生活，有序又優雅。</div>
            <div className="end-content-text-title-text">
              專業居家整理師，打造真正適合你的生活動線。
            </div>
          </div>
          <div className="end-content-btn">
            <button>立即預約</button>
            <button>查看案例</button>
          </div>
        </div>
      </div>
    </div>
  );

}