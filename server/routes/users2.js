import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import pool from "../connect.js"
import fileSystem from "fs/promises";
import pathModule from "path";

const upload = multer();
const secretKey = process.env.JWT_SECRET_KEY;
const router = express.Router();


// 把route(s)(路由規則) 整理在 routers(路由物件器) 裡
// 獲取所有使用者------------------------------
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

// 搜尋使用者----------------------------------
router.get("/search", (req, res) => {
  // 網址參數 (查詢參數)會被整理到 req 中的 query 裡
  const key = req.query.key;
  res.status(200).json({
    status: "success",
    data: { key },
    message: "搜尋使用者 成功 "
  });
});

// 獲取特定 ID的使用者----------------------------------
router.get("/:id", async (req, res) => {
  // 路由參數

  try {
    const id = req.params.id;
    if (!id) {
      const err = new Error("請提供使用者 ID");
      err.code = 400;
      err.status = "fail";
      throw err;
    }
    const sqlCheck1 = "SELECT * FROM `users` WHERE `id` = ?;";
    let user = await pool.execute(sqlCheck1, [id]).then(([result]) => {
      return result[0];
    });
    if (!user) {
      const err = new Error("找不到使用者");
      err.code = 404;
      err.status = "fail";
      throw err;
    }

    // 剩餘參數 （不顯示出來的資料）
    const { id: userId, password, is_valid, created_at, updated_at, ...data } = user;


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

// 註冊（新增一個使用者----------------------------------
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

// 更新(特定 ID)的使用者----------------------------------
router.put("/:id", checkToken, upload.single("avatar"), async (req, res) => {

  try {
    const userIdFromParam = req.params.id;
    const userIdFromToken = String(req.decoded.id);
    if (String(userIdFromParam) !== userIdFromToken) {
      return res.status(403).json({ status: "error", message: "無權限更新此帳號" });
    }

    const { name, birthday, phone, city, area, address, avatar } = req.body;

    // 撈目前(current)使用者（必要：之後要做 email 檢查、密碼更新）
    const [currentRows] = await pool.execute("SELECT * FROM users WHERE id=?", [userIdFromParam]);
    const currentUser = currentRows[0];
    if (!currentUser) return res.status(404).json({ status: "error", message: "找不到使用者" });

    // 準備 UPDATE 子句
    const updateFields = [];
    const updateValues = [];

    const maybeUpdate = { name, birthday, phone, city, area, address };
    for (const [columnName, newValue] of Object.entries(maybeUpdate)) {
      if (newValue !== undefined) {
        updateFields.push(`${columnName}=?`);
        updateValues.push(newValue);
      }
    }

    // Email：有提供才檢查 無重複 並更新 // 檢查重複(副本dup)
    if (newEmail !== undefined) {
      const [dup] = await pool.execute(
        "SELECT id FROM users WHERE email=? AND id<>? LIMIT 1"
        , [newEmail, userIdFromParam]);

      if (dup.length > 0) {
        return res.status(400).json({ status: "error", message: "Email 已被使用" });
      }
      updateFields.push("email=?");
      updateValues.push(newEmail);
    }

    // Password：有提供才更新
    if (newPassword !== undefined) {
      if (String(newPassword).length < 6) {
        return res.status(400).json({ 
          status: "error", 
          message: "新密碼至少 6 碼" 
        });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      updateFields.push("password=?");
      updateValues.push(hashed);
    }
    
    // Avatar：有檔案才存
    if (req.file) {
      const uploadDirectory = pathModule.join(process.cwd(), "public", "uploads", "avatars");
      await fileSystem.mkdir(uploadDirectory, { recursive: true });
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePathOnDisk = pathModule.join(uploadDirectory, fileName);
      await fileSystem.writeFile(filePathOnDisk, req.file.buffer);
      const publicUrlPath = `/uploads/avatars/${fileName}`;
      updateFields.push("avatar=?");
      updateValues.push(publicUrlPath);
    }
    if (updateFields.length === 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "沒有可更新的欄位" 
      });
    }

    updateValues.push(userIdFromParam);
    await pool.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id=?`
      , updateValues
    );

    const [rows] = await pool.execute(
      "SELECT id, name, birthday, email, phone, city, area, address, avatar FROM users WHERE id=?",
      [userIdFromParam]
    );
    const updatedUser = rows[0];

    return res.status(200).json({ 
      status: "success", 
      message: "會員資料更新成功", 
      data: { user: updatedUser } 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      status: "error", 
      message: "會員資料更新失敗" });
  }

    const sql = `
      UPDATE users 
      SET name=?, birthday=?, phone=?, city=?, area=?, address=? ,avatar=?
      WHERE id=?;
    `;
    await pool.execute(sql, [id, name, birthday, phone, city, area, address, avatar]);

    // 取回最新資料
    const [rows] = await pool.execute(
      "SELECT id, name, birthday, email, phone, city, area, address, avatar FROM users WHERE id=?",
      [id]
    );
    const user = rows[0];
    const newUser = {
      id: user.id,
      name: user.name,
      birthday: user.birthday,
      email: user.email,
      phone: user.phone,
      city: user.city,
      area: user.area,
      address: user.address,
      avatar: user.avatar,
    };

  
});         

// 更改 Email（需唯一）
router.put("/:id/email", checkToken, upload.none(), async (req, res) => {
  try {
    const id = req.params.id;
    if (!email)
      return res.status(400)
        .json({
          status: "error",
          message: "請提供 email"
        });
    // 檢查重複 (副本dup)
    const [dup] = await pool.execute(
      `SELECT id FROM users WHERE email=? AND id<>?`,
      [email, id]);

    if (dup.length) return
    res.status(400).json({
      status: "error",
      message: "Email 已被使用"
    });

    await pool.execute("UPDATE users SET email=? WHERE id=?", [email, id]);

    // 回傳最新 user
    const [rows] = await pool.execute(
      `SELECT id, name, birthday, email, phone, postcode, city, area, address, avatar FROM users WHERE id=?`,
      [id]
    );
    res.status(200).json({
      status: "success",
      message: "Email 已更新",
      data: { user: rows[0] }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "更新 Email 失敗"
    });
  }
});

// 更改密碼（以登入態為準）
router.put("/:id/password", checkToken, upload.none(), async (req, res) => {
  try {
    const id = req.params.id;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "新密碼至少 6 碼"
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      "UPDATE users SET password=? WHERE id=?"
      , [hashed, id]);
    res.status(200).json({
      status: "success",
      message: "密碼已更新"
    });
  } catch (e) {
    console.log(e);
    res.status(500)
      .json({
        status: "error",
        message: "更新密碼失敗"
      });
  }
});

// 上傳頭像（檔案）
router.put("/:id/avatar", checkToken, upload.single("avatar"), async (req, res) => {
  try {
    const id = req.params.id;
    // 如果有上傳檔案就用檔案，否則給預設
    const avatar = req.file ? req.file.filename : "/public/img/放入預設圖片.png";
    // 建立avatar存放資料夾路徑
    const avatarUploadPath = path.resolve("public/uploads/avatars");
    await fs.mkdir(avatarUploadPath, { recursive: true });
    // 取得目前的時間戳(毫秒)，將使用者上傳檔，用來確保每次上傳檔案都能有「唯一性」
    const filename = `${Date.now()}-${req.file.originalname}`;
    // 將 資料夾路徑＋生成檔名合併成完整路徑 並把 avatar存入後端
    const filepath = path.join(avatarUploadPath, filename);
    await fs.writeFile(filepath, req.file.buffer);
    // 給前端用的網址路徑
    const publicPath = `/uploads/avatars/${filename}`;
    // 更新頭像
    await pool.execute(
      "UPDATE users SET avatar=? WHERE id=?"
      , [publicPath, id]);
    // 再撈出新的頭像（給前端顯示）
    const [rows] = await pool.execute(
      "SELECT avatar FROM users WHERE id=?",
      [id]
    );
    res.status(200).json({
      status: "success",
      message: "頭像已更新",
      data: { user: rows[0] }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "上傳頭像失敗"
    });
  }
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

    // 1) 撈使用者
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

    // 2) 比對密碼
    // 測試完要改回來
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    if (!isMatch) {
      const err = new Error("帳號或密碼錯誤2");
      err.code = 400;
      err.status = "error ";
      throw err;
    }

    // 3) 簽發 token（30 分鐘）
    const token = jwt.sign({
      id: user.id,
      name: user.name,
      birthday: user.birthday,
      email: user.email,
      phone: user.phone,
      postcode: user.postcode,
      city: user.city,
      area: user.area,
      address: user.address,
      avatar: user.avatar,
    },
      secretKey,
      { expiresIn: "30m" }
    );
    // 4) 回前端用的精簡使用者資料
    const newUser = {
      id: user.id,
      name: user.name,
      birthday: user.birthday,
      email: user.email,
      phone: user.phone,
      postcode: user.postcode,
      city: user.city,
      area: user.area,
      address: user.address,
      avatar: user.avatar,
    }

    res.status(200).json({
      status: "success",
      message: "登入成功",
      data: { token, user: newUser },
    });
  } catch (error) {
    // 捕獲錯誤
    // console.log(error);
    // const statusCode = error.code ?? 400;
    // const statusText = error.status ?? "error";
    // const message = error.message ?? "登入失敗，請洽管理人員";

    // res.status(statusCode).json({
    //   status: statusText,
    //   message
    // });
    console.error("LOGIN_ERROR:", error);
    return res
      .status(500)
      .json({ status: "error", message: "登入失敗，請稍後再試" });
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
      id: user.id,
      name: user.name,
      birthday: user.birthday,
      email: user.email,
      phone: user.phone,
      postcode: user.postcode,
      city: user.city,
      area: user.area,
      address: user.address,
      avatar: user.avatar,
    }, secretKey, { expiresIn: "30m" });

    const newUser = {
      id: user.id,
      name: user.name,
      birthday: user.birthday,
      email: user.email,
      phone: user.phone,
      postcode: user.postcode,
      city: user.city,
      area: user.area,
      address: user.address,
      avatar: user.avatar,
    }

    res.status(200).json({
      status: "success",
      message: "處於登入狀態",
      data: { token, user: newUser },
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