"use client";

import Link from "next/link";
import Image from "next/image";
import "@/styles/header.css";
import { useCart } from '@/app/contexts/CartContext';


export default function Header() {
  const { cartCount } = useCart();

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
        {/* <Link>
          <i className="fa-solid fa-magnifying-glass"></i>
        </Link> */}
         <Link href="/cart" alt="" style={{ position: 'relative', display: 'inline-block' }}>
          <i className="fa-solid fa-cart-shopping"></i>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#DBA783',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              lineHeight: '1'
            }}>
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
        <button className="menu-toggle"  type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
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
