"use client"

import React,{ useState } from 'react';
import '@/styles/products/pid.css';

export default function PidPage(){
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: 'BAGGSDOA',
    price: 1999,
    images: [
      'https://via.placeholder.com/500x400/f0f0f0/666?text=Product1',
      'https://via.placeholder.com/500x400/f0f0f0/666?text=Product2',
      'https://via.placeholder.com/500x400/f0f0f0/666?text=Product3'
    ],
    description: '為你的生活角落增添一抹實用美感，這款北歐風簡約邊桌，採用實木材質與霧面烤漆，適合擺放於沙發側、床邊或閱讀角落。不僅能放置咖啡杯、書籍或燈具，極簡設計也能輕鬆融入各種空間風格。',
    specs: {
      dimensions: '77X44 公分',
      material: '高級布料',
      weight: '25kg'
    }
  };

  return (
    <div className="detail-product-page">
      {/* 麵包屑導航 */}
      <div className="sub-nav">
        <div className="sub-nav-links">
          <a href="#" className="sub-nav-link">專屬整理師諮詢</a>
          <a href="#" className="sub-nav-link">最新商品</a>
          <a href="#" className="sub-nav-link">
            熱賣
          </a>
          <a href="#" className="sub-nav-link">家具 <i className="fas fa-chevron-down"></i></a>
          <a href="#" className="sub-nav-link">It's Oakly</a>
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
      <div className="pid-container">
        <div className="product-detail-wrapper">
          {/* 左側商品圖片 */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* 右側商品資訊 */}
          <div className="pid-info">
            <div className="pid-name">{product.name}</div>
            <div className="express">邊桌, 白色, 71x50 公分</div>
            <div className="product-price">NT$ {product.price}</div>

            <div className="rating">
              <div className="rating-icon-container">
                <div className="rating-icon"><i class="fa-solid fa-star"></i></div>
                <div className="rating-icon"><i class="fa-solid fa-star"></i></div>
                <div className="rating-icon"><i class="fa-solid fa-star"></i></div>
                <div className="rating-icon"><i class="fa-solid fa-star"></i></div>
                <div className="rating-icon"><i class="fa-solid fa-star"></i> </div>
                <span className="rating-text">4.8</span>
              </div>
              <div className="view-review">查看評論</div>
            </div>

            <div className="product-description">
              {product.description}
            </div>

            <div className="product-specs">


              <div className="spec-item">
                <div className="spec-label">顏色：</div>
                <div className="colors">
                  <div className="color" style={{ backgroundColor: '#000' }}></div>
                  <div className="color" style={{ backgroundColor: '#224949' }}></div>
                  <div className="color" style={{ backgroundColor: '#555555' }}></div>
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
                <div className="saved-icon"><i class="fa-regular fa-heart"></i></div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="buy-now-btn">立即購買</button>
              <button className="add-to-cart-btn">加入購物車</button>

            </div>
            <div className="more-info">
              <div className="more-info-item-text">產品資訊<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5.5H8.5V1C8.5 0.447812 8.05219 0 7.5 0H6.5C5.94781 0 5.5 0.447812 5.5 1V5.5H1C0.447812 5.5 0 5.94781 0 6.5V7.5C0 8.05219 0.447812 8.5 1 8.5H5.5V13C5.5 13.5522 5.94781 14 6.5 14H7.5C8.05219 14 8.5 13.5522 8.5 13V8.5H13C13.5522 8.5 14 8.05219 14 7.5V6.5C14 5.94781 13.5522 5.5 13 5.5Z" fill="#6A6A6A" />
              </svg></div>
              <div className="more-info-item-text">設計師<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5.5H8.5V1C8.5 0.447812 8.05219 0 7.5 0H6.5C5.94781 0 5.5 0.447812 5.5 1V5.5H1C0.447812 5.5 0 5.94781 0 6.5V7.5C0 8.05219 0.447812 8.5 1 8.5H5.5V13C5.5 13.5522 5.94781 14 6.5 14H7.5C8.05219 14 8.5 13.5522 8.5 13V8.5H13C13.5522 8.5 14 8.05219 14 7.5V6.5C14 5.94781 13.5522 5.5 13 5.5Z" fill="#6A6A6A" />
              </svg></div>
              <div className="more-info-item-text">材質<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5.5H8.5V1C8.5 0.447812 8.05219 0 7.5 0H6.5C5.94781 0 5.5 0.447812 5.5 1V5.5H1C0.447812 5.5 0 5.94781 0 6.5V7.5C0 8.05219 0.447812 8.5 1 8.5H5.5V13C5.5 13.5522 5.94781 14 6.5 14H7.5C8.05219 14 8.5 13.5522 8.5 13V8.5H13C13.5522 8.5 14 8.05219 14 7.5V6.5C14 5.94781 13.5522 5.5 13 5.5Z" fill="#6A6A6A" />
              </svg></div>
              <div className="more-info-item-text">尺寸<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5.5H8.5V1C8.5 0.447812 8.05219 0 7.5 0H6.5C5.94781 0 5.5 0.447812 5.5 1V5.5H1C0.447812 5.5 0 5.94781 0 6.5V7.5C0 8.05219 0.447812 8.5 1 8.5H5.5V13C5.5 13.5522 5.94781 14 6.5 14H7.5C8.05219 14 8.5 13.5522 8.5 13V8.5H13C13.5522 8.5 14 8.05219 14 7.5V6.5C14 5.94781 13.5522 5.5 13 5.5Z" fill="#6A6A6A" />
              </svg></div>
              <div className="more-info-item-text">庫存<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5.5H8.5V1C8.5 0.447812 8.05219 0 7.5 0H6.5C5.94781 0 5.5 0.447812 5.5 1V5.5H1C0.447812 5.5 0 5.94781 0 6.5V7.5C0 8.05219 0.447812 8.5 1 8.5H5.5V13C5.5 13.5522 5.94781 14 6.5 14H7.5C8.05219 14 8.5 13.5522 8.5 13V8.5H13C13.5522 8.5 14 8.05219 14 7.5V6.5C14 5.94781 13.5522 5.5 13 5.5Z" fill="#6A6A6A" />
              </svg></div>

            </div>

          </div>
        </div>
        <div className="middle-content">
         <span>類似商品</span>
         <div className="best-seller-info">
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          </div>
        </div>
        

        <div className="third-content">
          <div className="towar-info">

          </div>
          <div className="towar-info">

          </div>
          <div className="towar-info">

          </div>
        </div>
     
        <div className="four-content">

        </div>
        <div className="middle-content">
         <span>推薦商品</span>
         <div className="best-seller-info">
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          </div>
        </div>
        <div className="middle-content">
         <span>最近瀏覽的商品</span>
         <div className="best-seller-info">
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          <div className="best-seller">

          </div>
          </div>
        </div>
       
      </div>
      <div className="end-content">
      <img src="/images/clean.jpg" alt="clean" /> {/* 這樣可以！ */}
          <div className="end-content-text">
        
            <div className="end-content-text-title-container">
            <div className="end-content-text-title">
              讓生活，有序又優雅。 </div>
            <div className="end-content-text-title-text">專業居家整理師，打造真正適合你的生活動線。 </div>
            </div>
            <div className="end-content-btn">
              <button>立即預約</button>
              <button>查看案例</button>
            </div>
          </div>

        </div>

    </div>



  );
};
