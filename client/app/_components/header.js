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
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // 搜尋功能
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(`http://localhost:3005/api/products/search?q=${encodeURIComponent(query)}`);

      const data = await response.json();
      console.log("🔍 API 回傳:", data); 

      
      if (data.status === 'success') {
        const productResults = data.data.map(product => ({
          id: product.id,
          title: product.name,
          type: 'product',
          url: `/products/${product.id}`,
          price: product.price,
          image: product.image
        }));
        setSearchResults(productResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('搜尋失敗:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 防抖搜尋
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // 點擊外部關閉搜尋
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
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
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // 獲取搜尋結果類型圖示
  const getSearchIcon = (type) => {
    return '🛋️';
  };

  return (
    <div className="container-fluid header">
      <div className="frame">
        <Link href="/" alt="">
          <img src="/img/Oakly-green.svg" alt="Oakly首頁" />
        </Link>
        <div className="menu">
          <Link className="nav-items" href="">
            <h6>商品列表</h6>
          </Link>
          <Link className="nav-items" href="">
            <h6>預約整理師</h6>
          </Link>
          <Link className="nav-items" href="">
            <h6>精選文章</h6>
          </Link>
          <Link className="nav-items" href="">
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
              
              {/* 搜尋結果下拉選單 */}
              {(searchResults.length > 0 || isSearching) && (
                <div 
                  ref={searchDropdownRef}
                  className="search-results"
                >
                  {isSearching ? (
                    <div className="search-loading">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>搜尋中...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={() => setIsSearchOpen(false)}
                          className="search-result-item"
                        >
                          <span className="search-result-icon">
                            {getSearchIcon(item.type)}
                          </span>
                          <div className="search-result-content">
                            <div className="search-result-title">{item.title}</div>
                            <div className="search-result-price">
                              NT$ {item.price ? item.price.toLocaleString() : '價格洽詢'}
                            </div>
                          </div>
                        </Link>
                      ))}
                      <div className="search-footer">
                        <Link 
                          href={`/products?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setIsSearchOpen(false)}
                        >
                          查看全部 "{searchQuery}" 的產品搜尋結果
                        </Link>
                      </div>
                    </>
                  ) : searchQuery.trim() && (
                    <div className="search-no-results">
                      沒有找到相關結果
                    </div>
                  )}
                </div>
              )}
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
          <Link href="/">
            <h6>註冊</h6>
          </Link>
          <Link href="/">
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
            <p>
              Try scrolling the rest of the page to see this option in action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}