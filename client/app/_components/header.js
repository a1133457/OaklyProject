"use client";

import Link from "next/link";
import Image from "next/image";
import "@/styles/header.css";

export default function Header() {
  return (
    <div className="container-fluid header" style={{ padding: "0 64px" }}>
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
        <Link href="/cart" alt="">
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>

        {/* <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
          <i className="fa-solid fa-cart-shopping"></i>
        </button>

        <div
          class="offcanvas offcanvas-end"
          data-bs-scroll="true"
          tabindex="-1"
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasScrollingLabel">
              購物車
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <p>
              Try scrolling the rest of the page to see this option in action.
            </p>
          </div>
        </div> */}

        <Link href="/auth/register">
          <h6>註冊</h6>
        </Link>
        <Link href="/auth/login">
          <h6>登入</h6>
        </Link>
      </div>
    </div>
  );
}
