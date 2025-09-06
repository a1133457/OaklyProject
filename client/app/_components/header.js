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

  // 處理搜尋按鈕點擊 - 防止震動
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
      // 修正：導航到搜尋結果頁面
      window.location.href = `/products/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
      setIsInputFocused(false);
    }
  };



  return (
    <div className="container-fluid header">
      <div className="frame">
        <Link href="/" alt="">
          <img src="/img/Oakly-green.svg" alt="Oakly首頁" />
        </Link>
        <div className="menu">
          <Link className="nav-items" href="/products">
            <h6>商品列表</h6>
          </Link>
          <Link className="nav-items" href="organizers">
            <h6>預約整理師</h6>
          </Link>
          <Link className="nav-items" href="article">
            <h6>精選文章</h6>
          </Link>
          <Link className="nav-items" href="/">
            <h6>常見問題</h6>
          </Link>
        </div>
      </div>

      <div className="icon-group">
        <Link href="/" alt="">
          <img src="/img/Oakly-green.svg" alt="Oakly首頁" />
        </Link>
        <div className="side-right">

        <Link href="/cart" alt="">
          <i className="fa-solid fa-cart-shopping ms-auto"></i>
        </Link>

        <div className="user-log">
          <Link href="/user/register">
            <h6>註冊</h6>
          </Link>
          <Link href="/user/login">
            <h6>登入</h6>
          </Link>
        </div>

        {/* <button className="menu-toggle">
          <i className="fa-solid fa-circle-user"></i>
        </button> */}

        <button
          className="menu-toggle"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* sidebar */}
        <div
          className="offcanvas offcanvas-end sidebar"
          tabIndex="-1"
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
        >
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasScrollingLabel">
              <a href="/">
                <img className="phoneLogo" src="/img/Oakly-green.svg" alt="Oakly首頁" />
              </a>
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
                <i></i>
                <a href="/products">
                  <span>商品列表</span>
                </a>
              </div>
              <div className="menu-item">
                <i>📰</i>
                <a href="/organizer">
                  <span>預約整理師</span>
                </a>
              </div>
              <div className="menu-item">
                <i>📰</i>
                <a href="/article">
                  <span>精選文章</span>
                </a>
              </div>
              <div className="menu-item">
                <i>⚙️</i>
                <a href="/">
                  <span>常見問題</span>
                </a>
              </div>

              {user ? (
                <div className="auth-user">
                  <div className="user-info">
                    <img src={user.avatar || "/img/default-avatar.png"} alt="頭像" className="avatar" />
                    <span>{user.name}</span>
                  </div>
                  <div className="user-submenu">
                    <a href="/user/profile" className="menu-item">
                      <i>👤</i>
                      <span>個人資料</span>
                    </a>
                    <a href="/dashboard/order" className="menu-item">
                      <i>📦</i>
                      <span>我的訂單</span>
                    </a>
                    <a href="/dashboard/coupon" className="menu-item">
                      <i>📦</i>
                      <span>我的優惠券</span>
                    </a>
                    <a href="/dashboard/favorite" className="menu-item">
                      <i>📦</i>
                      <span>我的最愛</span>
                    </a>
                    <a href="/dashboard/bookmark" className="menu-item">
                      <i>📦</i>
                      <span>收藏文章</span>
                    </a>
                    <button onClick={logout} className="menu-item">
                      <i>🚪</i>
                      <span>登出</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-menu">
                  <a href="/user/register" className="menu-item">
                    <i>📝</i>
                    <span>註冊</span>
                  </a>
                  <a href="/user/login" className="menu-item">
                    <i>🔑</i>
                    <span>登入</span>
                  </a>
                </div>
              )}

         
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}