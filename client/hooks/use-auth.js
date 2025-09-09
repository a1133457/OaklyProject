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

  const list = async () => {
    const API = "http://localhost:3005/api/users";
    try {
      const res = await fetch(API);
      const result = await res.json();
      console.log(result);

      if (result.status == "success") {
        setUsers(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(`使用者列表取得: ${error.message}`);
      setUsers([]);
      alert(error.message);
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
    localStorage.setItem(userKey, JSON.stringify({ user: updateUser }));
  };

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
      //setIsLoading(false);
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
          //setIsLoading(false);
        } else {
          //alert(result.message);
          //setIsLoading(false);
          // setUser(null);
          // localStorage.removeItem(appKey);
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
                    // localStorage.removeItem(appKey);
                    // router.push('/auth/login');
                    // router.replace(loginRoute)// 👈 token 驗證失敗跳登入頁 這是全域請在各頁導頁
                    // 接 吐司？
                }
            } catch (error) {
                console.log(`解析token失敗: ${error.message}`);
                setUser(null);
                localStorage.removeItem(appKey);
                // router.push('/auth/login');
                // router.replace(loginRoute);//解析錯誤回登入頁 這是全域請在各頁導頁
            }
        };
        checkToken();
    }, []);


  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, list, users, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
