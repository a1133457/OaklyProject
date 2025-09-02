"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/styles/header.css";
import { useCart } from '@/app/contexts/CartContext';

export default function Header() {
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // 點擊外部關閉搜尋
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 處理搜尋按鈕點擊
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  // 處理 Enter 鍵搜尋
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // 修正：導航到搜尋結果頁面
      window.location.href = `/products/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
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
        {/* 搜尋功能 */}
        <div className="search-container">
          <button 
            onClick={handleSearchToggle}
            className="search-btn"
          >
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
                placeholder="搜尋產品..."
                className="search-input"
              />
              

            </div>
          )}
        </div>

        <Link href="/cart" className="cart-link">
          <i className="fa-solid fa-cart-shopping"></i>
          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>

        <div className="user-log">
          <Link href="/register">
            <h6>註冊</h6>
          </Link>
          <Link href="/login">
            <h6>登入</h6>
          </Link>
        </div>

        <button className="menu-toggle">
          <i className="fa-solid fa-circle-user"></i>
        </button>
        <button className="menu-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
          <i className="fa-solid fa-bars"></i>
        </button>

        <div
          className="offcanvas offcanvas-end"
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
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