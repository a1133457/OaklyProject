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
    const updateFields = []; // 用陣列來記錄要更新的欄位
    const Values = []; // 用陣列來記錄要更新的欄位的值

    const maybeUpdate = { name, birthday, phone, city, area, address };
    for (const [columnName, newValue] of Object.entries(maybeUpdate)) {
      if (newValue !== undefined) {
        updateFields.push(`${columnName}=?`);
        Values.push(newValue);
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
      Values.push(newEmail);
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
      Values.push(hashed);
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
      Values.push(publicUrlPath);
    }
    if (updateFields.length === 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "沒有可更新的欄位" 
      });
    }

    Values.push(userIdFromParam);
    await pool.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id=?`
      , Values
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