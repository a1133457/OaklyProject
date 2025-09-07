"use client";

import { usePathname, useRouter } from "next/navigation";
import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";
const appKey = "reactLoginToken";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const loginRoute = "/user/login";
  const protectedRoutes = ["/user"];

  const login = async (account, password) => {
    console.log(`在 use-auth 中, ${account}, ${password}`);
    const API = "http://localhost:3005/api/users/login";
    const formData = new FormData();
    formData.append("account", account);
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
        setUser(result.data.user);
        localStorage.setItem(appKey, token);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
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
        // localStorage.setItem(appKey, token);
        localStorage.removeItem(appKey);
      } else {
        // alert(result.message);
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(`解析 token 失敗: ${error.message}`);
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

  useEffect(() => {
    if (!isLoading && !user && protectedRoutes.includes(pathname)) {
      router.replace(loginRoute); // 導頁
    }
  }, [isLoading, user, pathname]);

  useEffect(() => {
    const API = "http://localhost:3005/api/users/status";
    const token = localStorage.getItem(appKey);
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
          const token = result.data.token;
          setUser(result.data.user);
          localStorage.setItem(appKey, token);
          setIsLoading(false);
        } else {
          // alert(result.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(`解析 token 失敗: ${error.message}`);
        setUser(null);
        localStorage.removeItem(appKey);
      }
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, list, users }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
