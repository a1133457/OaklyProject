'use client'

 import React,{ useState } from 'react';
 import Link from 'next/link';
 import '@/styles/order/order-detail.css';

export default function OrderDetailPage() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pending-payment', label: '待付款' },
    { id: 'pending-shipment', label: '待出貨' },
    { id: 'pending-receipt', label: '待收貨' },
    { id: 'completed', label: '已完成' },
    { id: 'cancelled', label: '取消' },
    { id: 'return-refund', label: '退貨/退款' }
  ];

  const orders = [
    {
      id: '123456789',
      status: 'delivery',
      statusText: '配送中',
      product: {
        name: 'BAGGBODA',
        specs: '邊桌 71x50 公分',
        color: '白色',
        quantity: 1,
        price: 1999
      },
      discounts: [50, 60],
      total: 1880,
      recipient: '金珍妮',
      phone: '09123456789',
      address: '韓國首爾江南區520號',
      shippingMethod: '7-11黑貓宅急便',
      paymentMethod: '信用卡'
    }
  ]

  return (
    <div className="order-detail-page">
    

      {/* 主要內容區域 */}
      <div className="main-content">
     
            {/* 左側邊欄 */}
            <aside className="sidebar">
              <nav className="user-menu">
                <div className="menu-item">
                  <i className="fas fa-user"></i>
                  <span>我的資料</span>
                </div>
                <div className="menu-item active">
                  <i className="fas fa-list-alt"></i>
                  <span>訂單查詢</span>
                </div>
                <div className="menu-item">
                  <i className="fas fa-ticket-alt"></i>
                  <span>我的優惠券</span>
                </div>
                <div className="menu-item">
                  <i className="fas fa-heart"></i>
                  <span>我的願望清單</span>
                </div>
                <div className="menu-item">
                  <i className="fas fa-comments"></i>
                  <span>我的評論</span>
                </div>
                <div className="menu-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>預約紀錄</span>
                </div>
              </nav>
            </aside>

            {/* 右側訂單詳情內容 */}
            <main className="order-detail-content">
                {/* 訂單狀態標籤頁 */}
      <div className="order-tabs">
        
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
        
      </div>
              {/* 搜尋欄 */}
              <div className="search-section">
                <div className="search-bar">
                  <i className="fas fa-search"></i>
                  <input type="text" placeholder="搜尋訂單編號 / 商品名稱" />
                </div>
              </div>

              {/* 訂單列表 */}
              <div className="order-list">
                {orders.map((order, index) => (
                  <div key={`${order.id}-${index}`} className="order-item">
                    <div className="order-header">
                      <div className="order-number">
                        <i className="fas fa-leaf"></i>
                        訂單編號 : {order.id}
                      </div>
                      <div className="order-status">
                        <span className={`status-btn ${order.status}`}>{order.statusText}</span>
                      </div>
                    </div>
                   
                    <div className="order-details">
                        <div className="product-image">
                          <img src="https://via.placeholder.com/80x80/f0f0f0/666?text=Table" alt="邊桌" />
                        </div>
                        <div className="order-info">
                        <div className="product-info">
                          <div className="product-name">{order.product.name}</div>
                          <div className="product-specs">
                            <span>{order.product.specs}</span>
                            <span>{order.product.color}</span>
                           
                        
                        </div>
                        <div className="info-tag">付款明細</div>              

                        <div className="pricing-details">
                        <div className="details">

                        <span>優惠券折扣</span>
                        <span>運費折扣</span>
                        </div>
                        <div className="discount-details">

                          <div className="quantity-price">{order.product.quantity} x ${order.product.price}</div>
                          {order.discounts.map((discount, i) => (
                            <div key={i} className="discount">- ${discount}</div>
                          ))}
                          </div>
                        </div>
                      </div>
                      <div className="info-tag">運送資訊</div>              
                      <div className="delivery-info">                
                          <div className="recipient">收件者 : {order.recipient}</div>
                          <div className="phone">手機號碼 : {order.phone}</div>
                          <div className="address">地址 : {order.address}</div>
                          <div className="shipping-method">運送方式 : {order.shippingMethod}</div>
                          <div className="payment-method">付款方式 : {order.paymentMethod}</div>
                        </div>
                     
                      </div>
                    </div>
                  
                    <div className="order-total">
                        訂單金額 : ${order.total}
                      </div>
                    
                  </div>
                 
                  
                ))}
              </div>
              <div className='return-container'>
              <Link href="/order">
              <div className='return'>返回</div>
              </Link>
              </div>
           
            </main>
            
        
      </div>
    </div>
  );
};
