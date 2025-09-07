'use client';

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
  const pathname = usePathname();
  const loginRoute = "/user/login";
  const protectedRoutes = ["/user", "/order/detail",];

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
        localStorage.removeItem(user);
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
        email: user.email || ""
      };
    }

    // 如果 newData 裡有 recipient，就更新 user.recipient
    if (newData.recipient) {
      updateUser.recipient = newData.recipient;
    }
    setUser(updateUser);
    localStorage.setItem(userKey, JSON.stringify({ user: updateUser }));
  }

  // 保護頁面------------------------------------
  useEffect(() => {
    if (!isLoading && !user && protectedRoutes.includes(pathname)) {
      router.replace(loginRoute); // 導頁
    }
  }, [isLoading, user, pathname]);

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


  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, list, users, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
