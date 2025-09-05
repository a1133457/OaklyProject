"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import "@/styles/header.css";
import { useCart } from '@/app/contexts/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const searchInputRef = useRef(null);

  // 點擊外部關閉搜尋
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setIsInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 處理搜尋按鈕點擊
  const handleSearchToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSearchOpen(prev => !prev);
  };

  // 處理輸入框焦點
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  // 處理 Enter 鍵搜尋
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/products/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
      setIsInputFocused(false);
    }
  };

  return (
    <div className="container-fluid header">
      <div className="frame">
        <Link href="/">
          <img src="/img/Oakly-green.svg" alt="Oakly首頁" />
        </Link>
        
        <div className="menu">
          <Link className="nav-items" href="/products">
            <h6>商品列表</h6>
          </Link>
          <Link className="nav-items" href="/appointment">
            <h6>預約整理師</h6>
          </Link>
          <Link className="nav-items" href="/articles">
            <h6>精選文章</h6>
          </Link>
          <Link className="nav-items" href="/faq">
            <h6>常見問題</h6>
          </Link>
        </div>
      </div>

      <div className="icon-group">
        <div className="side-right">
          {/* 搜尋功能 */}
          <div className="search-container">
            <button onClick={handleSearchToggle} className="search-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            {isSearchOpen && (
              <div className="search-input-container">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="搜尋產品..."
                  className="search-input"
                />
              </div>
            )}
          </div>

          {/* 購物車 */}
          <Link href="/cart" className="cart-link">
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* 用戶登入 */}
          <div className="user-log">
            <Link href="/register">
              <h6>註冊</h6>
            </Link>
            <Link href="/login">
              <h6>登入</h6>
            </Link>
          </div>

          {/* 手機選單按鈕 */}
          <button 
            className="menu-toggle" 
            type="button" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#offcanvasScrolling" 
            aria-controls="offcanvasScrolling"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>

      {/* sidebar */}
      <div
        className="offcanvas offcanvas-end sidebar"
        tabIndex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div className="offcanvas-header">
          <div className="offcanvas-title" id="offcanvasScrollingLabel">
            <Link href="/">
              <img className="phoneLogo" src="/img/Oakly-green.svg" alt="Oakly首頁" />
            </Link>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body">
          <div className="user-menu">
            <div className="menu-item">
              <Link href="/products">
                <span>商品列表</span>
              </Link>
            </div>
            <div className="menu-item">
              <Link href="/appointment">
                <span>預約整理師</span>
              </Link>
            </div>
            <div className="menu-item">
              <Link href="/articles">
                <span>精選文章</span>
              </Link>
            </div>
            <div className="menu-item">
              <Link href="/faq">
                <span>常見問題</span>
              </Link>
            </div>

            {user ? (
              <div className="auth-user">
                <div className="user-info">
                  <img src={user.avatar || "/img/default-avatar.png"} alt="頭像" className="avatar" />
                  <span>{user.name}</span>
                </div>
                <div className="user-submenu">
                  <Link href="/user/profile" className="menu-item">
                    <span>個人資料</span>
                  </Link>
                  <Link href="/dashboard/order" className="menu-item">
                    <span>我的訂單</span>
                  </Link>
                  <Link href="/dashboard/coupon" className="menu-item">
                    <span>我的優惠券</span>
                  </Link>
                  <Link href="/dashboard/favorite" className="menu-item">
                    <span>我的最愛</span>
                  </Link>
                  <Link href="/dashboard/bookmark" className="menu-item">
                    <span>收藏文章</span>
                  </Link>
                  <button onClick={logout} className="menu-item">
                    <span>登出</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-menu">
                <Link href="/register" className="menu-item">
                  <span>註冊</span>
                </Link>
                <Link href="/login" className="menu-item">
                  <span>登入</span>
                </Link>
              </div>
            )}

            <div className="mobile-menu">
              <Link href="/products" className="mobile-menu-item">商品列表</Link>
              <Link href="/appointment" className="mobile-menu-item">預約整理師</Link>
              <Link href="/articles" className="mobile-menu-item">精選文章</Link>
              <Link href="/faq" className="mobile-menu-item">常見問題</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}