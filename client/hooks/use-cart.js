"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

// #region 1. 建立 CartContext
const CartContext = createContext(null);
CartContext.displayName = "cartContext";
// #endregion

// #region 2. 建立&導出 Provider 元件(狀態在其中管理)
export function CartProvider({ children }) {
  // 購物車中購買項目狀態
  const [cartItems, setCartItems] = useState([]);
  // 使用 useRef 來追蹤是否已經初始化，避免初始渲染時的寫入
  const isInitialized = useRef(false);

  // 處理新增
  const handleAdd = (product) => {
    // 先判斷此商品是否已經在購物車
    const foundIndex = cartItems.findIndex((v) => v.id === product.id);

    // 如果有找到
    if (foundIndex !== -1) {
      // 做遞增
      handleIncrease(product.id);
    } else {
      // 做新增
      // 先寫出要新增的物件值，因為商品(product)和購物車項目(cartItem)間差了一個數量(count)屬性，預設為 1
      const newCartItem = { ...product, count: 1 };
      setCartItems([newCartItem, ...cartItems]);
    }
  };

  // 處理遞增
  const handleIncrease = (cartItemId) => {
    // 第一層用陣列的 map 來展開每個成員
    const nextCartItems = cartItems.map((cartItem) => {
      // 如果比對出 id = cartItemId 的成員，進行展開物件並遞增 count 的值
      if (cartItem.id === cartItemId) {
        return { ...cartItem, count: cartItem.count + 1 };
      } else {
        return cartItem;
      }
    });
    // 3 設定回狀態
    setCartItems(nextCartItems);
  };

  // 處理遞減
  const handleDecrease = (cartItemId) => {
    // 第一層用陣列的 map 來展開每個成員
    const nextCartItems = cartItems.map((cartItem) => {
      // 如果比對出 id = cartItemId 的成員，進行展開物件並遞減 count 的值
      if (cartItem.id === cartItemId) {
        return { ...cartItem, count: cartItem.count - 1 };
      } else {
        return cartItem;
      }
    });
    // 3 設定回狀態
    setCartItems(nextCartItems);
  };

  //處理刪除
  const handleRemove = (cartItemId) => {
    const nextCartItems = cartItems.filter((cartItem) => {
      return cartItem.id !== cartItemId;
    });

    // 3 設定回狀態
    setCartItems(nextCartItems);
  };

  // 使用陣列的迭代方法 reduce(累加/歸納)
  const totalQty = cartItems.reduce((acc, v) => acc + v.count, 0);
  const totalAmount = cartItems.reduce((acc, v) => acc + v.price, 0);

  // 統一的 localStorage 同步化處理
  useEffect(()=>{
    // 第一次渲染時，從 localStorage 讀取資料
    if(!isInitialized.current){
        try{
            const storedItems = JSON.parse(localStorage.getItem("cart")) || [];
            setCartItems(storedItems);
            isInitialized.current = true;
        }catch(error){
            console.error("讀取購物車資料失敗: ", error);
            // 如果讀取失敗，清空 localStorage 中的購物車資料
            localStorage.removeItem("cart");
            isInitialized.current = true;
            
        }
    }else{
        // 後續的 cartItems 變更，寫入 localStorage
        try{
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }catch(error){
            console.error("儲存購物車資料失敗: ", error)
        }
    }
  }, [cartItems])

  return (
    <CartContext.Provider
        value={{
            cartItems,
            totalAmount,
            totalQty,
            handleAdd,
            handleDecrease,
            handleIncrease,
            handleRemove,
        }}
        >
            {children}
        </CartContext.Provider>
  )
}
// #endregion

// #region 3. 客製 & 導出 useCart 勾子(包裝 useContext(CartContext))
export const useCart = () => useContext(CartContext);
// #endregion
