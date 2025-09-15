"use client";

import { usePathname, useRouter } from "next/navigation";
import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";
const appKey = "reactLoginToken";
// 存 user 資料的 localStorage key
const userKey = "user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState([]);
  const router = useRouter();

  // register------------------------------------
  const register = async (name, email, password) => {
    // 前端基本驗證（和登入一樣走 FormData，維持一致）
    // const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // if (!name || !email || !password) {
    //   return { success: false, message: "請填寫完整資料" };
    // }
    // if (!emailOK) {
    //   return { success: false, message: "Email 格式不正確" };
    // }
    // if (password.length < 6) {
    //   return { success: false, message: "密碼至少需 6 碼" };
    // }

    const API = "http://localhost:3005/api/users";
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      // 後端成功：{ status: "success", message: "註冊成功" }
      if (result.status === "success") {
        return { success: true, message: result.message || "註冊成功" };
      } else {
        return {
          success: false,
          message: result.message || "註冊失敗，請稍後再試",
        };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "伺服器錯誤，請稍後再試" };
    }
  };

  // login------------------------------------
  const login = async (email, password) => {
    console.log(`在 use-auth 中, ${email}, ${password}`);
    const API = "http://localhost:3005/api/users/login";
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log(result);

      if (result.status == "success") {
        const token = result.data.token;
        const user = result.data.user;
        setUser(user);
        localStorage.setItem(appKey, token);
        localStorage.setItem(userKey, JSON.stringify(user));
        console.log("成功");
        router.push("/");

        return { success: true, message: result.message };
      } else {
        console.log("失敗");
        //alert(result.message);
        return { success: false, message: result.message };
        // 接 吐司？
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "伺服器錯誤，請稍後再試" };
    }
  };

  // logout------------------------------------
  const logout = async () => {
    console.log("logout");
    const API = "http://localhost:3005/api/users/logout";
    const appKey = "reactLoginToken";
    const userKey = "user";
    const cart = "cart";
    const token = localStorage.getItem(appKey);
    try {
      if (!token) throw new Error("Token 不存在");
      const res = await fetch(API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status == "success") {
        const token = result.data;
        setUser(null);
        //localStorage.setItem(appKey, token);
        localStorage.removeItem(appKey);
        localStorage.removeItem(userKey);
        router.push("/");
        // return { success: true };
      } else {
        //alert(result.message)
        // 接 吐司？
        throw new Error(result.message); //老師版
        //return { success: false, message: result.message };
      }
    } catch (error) {
      console.log(`解析token失敗: ${error.message}`);
      setUser(null);
      localStorage.removeItem(appKey);
      alert(error.message);
    }
  };

  // updateUserEdit------------------------------------
  const updateUserEdit = async (id, data) => {
    const API = `http://localhost:3005/api/users/${id}/edit`;
    const token = localStorage.getItem(appKey);

    try {
      const form = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          form.append(key, value);
        }
      });
      const res = await fetch(API, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const result = await res.json();

      if (result.status === "success") {
        // 更新前端 user 狀態
        // const newUser = { ...user, ...data };
        const newUser = result.data?.user ? result.data.user : { ...user, ...data };
        setUser(newUser);
        localStorage.setItem(userKey, JSON.stringify(newUser));
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: "伺服器錯誤" };
    }
  };
  // 更新密碼
  const updateUserPassword = async (id, newPassword) => {
    const API = `http://localhost:3005/api/users/${id}/password`;
    const token = localStorage.getItem(appKey);
    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: new URLSearchParams({ password: newPassword }),
      });
      const result = await res.json();
      if (result.status === "success") {
        return { success: true, message: result.message || "密碼更新成功" };
      }
      return { success: false, message: result.message || "密碼更新失敗" };
    } catch {
      return { success: false, message: "伺服器錯誤" };
    }
  };

  // 更新頭像
  const updateUserAvatar = async (id, file) => {
    const API = `http://localhost:3005/api/users/${id}/avatar`;
    const token = localStorage.getItem(appKey);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      if (result.status === "success") {
        // 若後端回傳最新 user 或 avatar 路徑，就同步更新前端
        const newUser = result.data?.user
          ? result.data.user
          : (result.data?.avatar ? { ...user, avatar: result.data.avatar } : user);

        setUser(newUser);
        localStorage.setItem(userKey, JSON.stringify(newUser));
        return { success: true, message: result.message || "頭像更新成功" };
      }
      return { success: false, message: result.message || "頭像更新失敗" };
    } catch {
      return { success: false, message: "伺服器錯誤" };
    }
  };

  // 更新訂購人跟收件人---------------------------
  const updateUser = (newData) => {
    // newData 可以是 { buyer } 或 { recipient }，更新第二次會覆蓋
    const updateUser = { ...user };

    if (newData.buyer) {
      updateUser.buyer = newData.buyer;
    } else if (!updateUser.buyer) {
      // 如果 user.buyer 不存在，就用原本 user 的資料當 buyer 初始值
      updateUser.buyer = {
        name: user.name || "",
        phone: user.phone || "",
        postcode: user.postcode || "",
        city: user.city || "",
        address: user.address || "",
        email: user.email || "",
      };
    }

    // 如果 newData 裡有 recipient，就更新 user.recipient
    if (newData.recipient) {
      updateUser.recipient = newData.recipient;
    }
    setUser(updateUser);
    localStorage.setItem(userKey, JSON.stringify(updateUser));
  }

  // 保護頁面------------------------------------
  // useEffect(() => {
  //     if (!isLoading && !user && protectedRoutes.includes(pathname)) {
  //         router.replace(loginRoute); // 導頁
  //     }
  // }, [isLoading, user, pathname]);


  // status------------------------------------
  useEffect(() => {
    const API = "http://localhost:3005/api/users/status";
    const token = localStorage.getItem(appKey);
    // console.log("checkToken token:", token);

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    const checkToken = async () => {
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.status == "success") {
          const token = result.data.token; // 伺服器會回新的 30 分 token
          setUser(result.data.user);
          localStorage.setItem(appKey, token); // 覆蓋舊的 token
          setIsLoading(false);
        } else {
          //alert(result.message);
          setIsLoading(false);
          // setUser(null);
          localStorage.clear();
          // router.push('/auth/login');
          // 接 吐司？
        }
      } catch (error) {
        console.log(`解析token失敗: ${error.message}`);
        setUser(null);
        localStorage.removeItem(appKey);
        // router.push('/auth/login');
      }
    };
    checkToken();
  }, []);

  // 收藏 API ------------------------------
  const API_FAVORITES = "http://localhost:3005/api/users/favorites";

  return (
    <AuthContext.Provider
      value={{
        user, register, login, logout, isLoading, users,
        updateUser, updateUserEdit, updateUserPassword, updateUserAvatar
      }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
