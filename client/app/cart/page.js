"use client";

import CartCard from "./_components/cartCard";
import Gradation from "./_components/gradation";
import Total from "./_components/total";
import "@/styles/cart/cartOrder.css";
import { useCart } from "@/hooks/use-cart";
// sweetalert2 對話盒
import Swal from "sweetalert2";
// sweetalert2 整合 react 的函式
import withReactContent from "sweetalert2-react-content";


export default function CartOrderPage() {
  const { items, onDecrease, onIncrease, onRemove, totalQty, totalAmount } = useCart();

  // 跳出確認對話盒的函式
  const confirmAndRemove = (item) => {
    // 先包裝給 React 用的物件
    const MySwal = withReactContent(Swal);
    // 官網範例(改用MySwal呼叫)
    Swal.fire({
      title: "確定要刪除嗎?",
      text: `${item.name} 將會從購物車中被刪除，此操作無法復原`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "取消",
      confirmButtonText: "確認刪除!",
    }).then((result) => {
      // 如果使用者按下確認按鈕後執行這裡
      if (result.isConfirmed) {
        // 執行刪除
        onRemove(item.id);

        // 跳出刪除成功對話盒
        Swal.fire({
          title: "已成功刪除",
          text: `${item.name} 已從購物車中被刪除`,
          icon: "success"
        });
      }
    });
  }

  return (
    <div className="container-fluid">
      <Gradation step="order" />
      <div className="cart">
        <div className="left-side">
          <div className="cart-main-title">
            <div className="choose-all">
              <input type="checkbox" placeholder="選擇全部" />
              <h6>選擇全部</h6>
            </div>
            <button
              onClick={() => {
                if (!items || items.length === 0) {
                  // 如果購物車沒有商品
                  Swal.fire({
                    title: "購物車是空的",
                    text: "沒有商品可以刪除",
                    icon: "info",
                    confirmButtonText: "確定",
                  });
                } else {
                  // sweetalert2 對話盒
                  confirmAndRemove(item);
                }
              }}
            >
              <i className="fa-solid fa-trash"></i>刪除
            </button>
          </div>
          <div className="cart-main-first">
            <h4>訂單資訊</h4>
            <CartCard type="order" />
          </div>
        </div>
        <div className="orange-side">
          <Total type="order" />
        </div>
      </div>
    </div>
  );
}
