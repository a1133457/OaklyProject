import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import pool from "../connect.js"

const upload = multer();
const secretKey = process.env.JWT_SECRET_KEY;
const router = express.Router();


// 把route(s)(路由規則) 整理在 routers(路由物件器) 裡
// 獲取所有使用者
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM `users` ";
    let [users] = await pool.execute(sql);

    res.status(200).json({
    status: "success",
    data: users,
    message: "已 獲取所有使用者"
  });
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";

    res.status(statusCode).json({
      status: statusText,
      message
    });
  }
});

// 搜尋使用者
router.get("/search", (req, res) => {
  // 網址參數 (查詢參數)會被整理到 req 中的 query 裡
  const key = req.query.key;
  res.status(200).json({
    status: "success",
    data: { key },
    message: "搜尋使用者 成功 "
  });
});

// 獲取特定 ID的使用者
router.get("/:id", async (req, res) => {
  // 路由參數

  try {
    const email = req.params.id;
    if(!email){
      const err = new Error("請提供使用者 ID"); 
      err.code = 400; 
      err.status = "fail"; 
      throw err;
    }
    const sqlCheck1 = "SELECT * FROM `users` WHERE `name` = ?;";
    let user = await pool.execute(sqlCheck1, [email]).then(([result]) => {
      return result[0];
    });
    if (!user) {
      const err = new Error("找不到使用者"); 
      err.code = 404; 
      err.status = "fail"; 
      throw err;
    }

    // 剩餘參數 （不顯示出來的資料）
    const {id , password, is_valid, created_at, updated_at, ...data} = user;


    res.status(200).json({
    status: "success",
    data,
    message: "查詢成功"
  });
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";

    res.status(statusCode).json({
      status: statusText,
      message
    });
  }
});

// 註冊（新增一個使用者）
router.post("/", upload.none(), async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 1) 必填欄位檢查（避免 undefined）
    if (!email || !password || !name) {
      const err = new Error("請提供完整的使用者資訊"); // Error 物件只能在小括號中自訂錯誤訊息
      err.code = 400; // 利用物件的自訂屬性把 HTTP 狀態碼帶到 catch
      err.status = "fail"; // 利用物件的自訂屬性把status字串帶到 catch
      throw err;
    }
    // 檢查 email 有沒有使用過
    const sqlCheck1 = "SELECT * FROM `users` WHERE `email` = ?;";
    let user = await pool.execute(sqlCheck1, [email]).then(([result]) => {
      return result[0];
    });
    if (user) {
      const err = new Error("提供的註冊資料已被使用"); // Error 物件只能在小括號中自訂錯誤訊息
      err.code = 400; // 利用物件的自訂屬性把 HTTP 狀態碼帶到 catch
      err.status = "fail"; // 利用物件的自訂屬性把status字串帶到 catch
      throw err;
    }

    // 檢查 XX 有沒有使用過
    // const sqlCheck2 = "SELECT * FROM `users` WHERE `email` = ?;";
    // user = await pool.execute(sqlCheck1, [email]).then(([result])=>{
    //   return result[0]; 
    // });
    // if(user){
    //   const err = new Error("提供的註冊資料已被使用"); 
    //   err.code = 400; 
    //   err.status = "fail"; 
    //   throw err;
    // } 

    // 3) 產生頭像（可能為 null)(取用下面function Randomuser.me)
    const avatar = await getRandomAvatar();
    // 4) 壓縮密碼
    const hashedPassword = await bcrypt.hash(password, 10);
    // 5) 建立 SQL 語法,寫入資料（undefined 一律轉成 null）
    const sql = "INSERT INTO `users` (name, email, password, avatar) VALUES(?, ?, ?, ?);";
    await pool.execute(
      sql, [name, email, hashedPassword, avatar]
    );

    res.status(201).json({
      status: "success",
      data: {},
      message: "註冊成功"
    });
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "註冊失敗，請洽管理人員";

    res.status(statusCode).json({
      status: statusText,
      message
    });
  }
});

// 更新(特定 ID)的使用者
router.put("/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: "更新(特定 ID)的使用者 成功"
  });
});

// 刪除(特定 ID)的使用者
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: "刪除(特定 ID)的使用者 成功 "
  });
});

// 使用者登入
router.post("/login", upload.none(), async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await pool
      .execute('SELECT * FROM users WHERE `email`= ?', [email])
      .then(([result]) => {
        // console.log(result);
        return result[0];
      });

    console.log(user);

    if (!user) {
      const err = new Error("帳號或密碼錯誤1"); // Error 物件只能在小括號中自訂錯誤訊息
      err.code = 400;   // 利用物件的自訂屬性把 HTTP 狀態碼帶到 catch
      err.status = "error "; // 利用物件的自訂屬性把status字串帶到 catch
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("帳號或密碼錯誤2");
      err.code = 400;
      err.status = "error ";
      throw err;
    }

    const token = jwt.sign({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
      secretKey,
      { expiresIn: "30m" }
    );
    const newUser = {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    } 

    res.status(200).json({
      status: "success",
      message: "登入成功",
      data: {token, user: newUser},
    });
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登入失敗，請洽管理人員";

    res.status(statusCode).json({
      status: statusText,
      message
    });
  }
});


// 使用者登出
router.post("/logout", checkToken, async (req, res) => {
  try {
    const { email } = req.decoded;

    const sqlCheck1 = "SELECT * FROM `users` WHERE `email` = ?;";
    let user = await pool.execute(sqlCheck1, [email]).then(([result]) => {
      return result[0];
    });
    if (!user) {
      const err = new Error("登出失敗");
      err.code = 401;
      err.status = "error";
      throw err;
    }

    const token = jwt.sign({
      message: "過期的token"
    }, secretKey, { expiresIn: "-10s" });
    res.status(200).json({
      status: "success",
      message: "登出成功",
      data: token
    });
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登出失敗，請洽管理人員";

    res.status(statusCode).json({
      status: statusText,
      message
    });
  }
});

// 檢查登入狀態
router.post("/status", checkToken, async (req, res) => {
  try {
    const { email } = req.decoded;

    const sqlCheck1 = "SELECT * FROM `users` WHERE `email` = ?;";
    let user = await pool
    .execute(sqlCheck1, [email])
    .then(([result]) => {
      return result[0];
    });

    if (!user) {
      const err = new Error("請登入");
      err.code = 401; 
      err.status = "error";
      throw err;
    }

    const token = jwt.sign({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    secretKey, 
    { expiresIn: "30m" });

    const newUser = {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }

    res.status(200).json({
      status: "success",
      message: "處於登入狀態",
      data: {token, user: newUser},
    });
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";

    res.status(statusCode).json({
      status: statusText,
      message
    });
  }
});

function checkToken(req, res, next) {
  // console.log("checkToken");

  let token = req.get("Authorization");
  console.log("收到的 header:", token);

  if (token && token.includes("Bearer ")) {
    // 有符合
    token = token.slice(7);
    console.log("解析後的 token:", token);
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.log("JWT 驗證失敗:", error);
        res.status(401).json({
          status: "error",
          message: "登入驗證失效 ,請重新登入",
        });

        return;
      }
      console.log("JWT 驗證成功:", decoded);
      req.decoded = decoded;
      next();
    });
  } else {
    // 沒有符合
    res.status(401).json({
      status: "error",
      message: "無登入驗證資訊,請重新登入",
    });
  }

}

async function getRandomAvatar() {
  const API = "https://randomuser.me/api";
  try {
    const response = await fetch(API);
    if (!response.ok)
      throw new Error(`${response.status}: ${response.statusText}`);
    const result = await response.json();
    return result.results[0].picture.large;
  } catch (error) {
    console.log("getRandomAvatar", error.message);
    return null;
  }
}

export default router;