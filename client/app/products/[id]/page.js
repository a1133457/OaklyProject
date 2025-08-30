"use client";

import React, { useState, useEffect } from "react";
import "@/styles/products/pid.css";
import SimilarProducts from "@/app/_components/SimilarProducts.js";
import RecentViewedProducts from "@/app/_components/RecentViewedProducts.js";
import RandomShowcaseSection from "@/app/_components/RandomShowcaseSection.js";
import { useCart } from '@/app/contexts/CartContext.js';




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

  if (loading) {
    return (
      <div className="detail-product-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="loading-spinner" style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px' }}>載入產品資料中...</p>
        </div>
      </div>
    );
  }

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
          <div className="dropdown hover-dropdown">
            <div
              className="sub-nav-link dropdown-toggle"
              aria-expanded="false"
            >
              空間<i className="fas fa-chevron-down  fa-sm"></i>
            </div>
            <div className="dropdown-menu dropdown-megamenu">
              <div className="megamenu-column">
                <h6 className="dropdown-header">客廳</h6>
                <a className="dropdown-item" href="#">邊桌</a>
                <a className="dropdown-item" href="#">單椅/單人沙發</a>
                <a className="dropdown-item" href="#">茶几</a>
                <a className="dropdown-item" href="#">書櫃 / 書架</a>
                <a className="dropdown-item" href="#">書桌 / 書桌椅</a>
                <a className="dropdown-item" href="#">邊櫃 / 收納櫃</a>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">廚房</h6>
                <a className="dropdown-item" href="#">實木餐桌</a>
                <a className="dropdown-item" href="#">餐椅 / 椅子</a>
                <a className="dropdown-item" href="#">吧台桌</a>
                <a className="dropdown-item" href="#">吧台椅</a>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">臥室</h6>
                <a className="dropdown-item" href="#">床架</a>
                <a className="dropdown-item" href="#">床邊桌</a>
                <a className="dropdown-item" href="#">化妝台</a>
                <a className="dropdown-item" href="#">全身鏡 / 鏡子</a>
                <a className="dropdown-item" href="#">衣櫃 / 衣架</a>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">兒童房</h6>
                <a className="dropdown-item" href="#">桌椅組</a>
                <a className="dropdown-item" href="#">衣櫃</a>
                <a className="dropdown-item" href="#">床架</a>
                <a className="dropdown-item" href="#">收納櫃</a>
              </div>
              <div className="megamenu-column">
                <h6 className="dropdown-header">收納空間</h6>
                <a className="dropdown-item" href="#">收納盒 / 收納箱</a>
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
                onClick={() => setShowModal(true)}


              >
                查看評論
              </button>

              <div
                className={`modal fade ${showModal ? 'show' : ''}`}
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
                        onClick={() => setShowModal(false)}
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
                  onClick={() => setShowModal(false)}


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
                      className="color"
                      style={{ backgroundColor: getColorCode(color.color_name) }}
                      title={color.color_name}
                    ></div>
                  )) || (
                      <>
                        <div className="color" style={{ backgroundColor: "#000" }}></div>
                        <div className="color" style={{ backgroundColor: "#224949" }}></div>
                        <div className="color" style={{ backgroundColor: "#555555" }}></div>
                      </>
                    )}
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
                <div className="saved-icon">
                  <i className="fa-regular fa-heart"></i>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="buy-now-btn">立即購買</button>
              <button
                className="add-to-cart-btn"
                onClick={() => {
                  console.log('商品資料：', productData);
                  addToCart(productData, quantity);
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

        <SimilarProducts currentProductId={parseInt(productId)} />


        <RandomShowcaseSection />


        <SimilarProducts currentProductId={parseInt(productId)} />

        <RecentViewedProducts
          className="middle-content"
          currentProductId={productId}
          maxItems={8}
        />
      </div>


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