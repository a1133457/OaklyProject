import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import connection from "../connect.js";

const upload = multer();
const secretKey = process.env.JWT_SECRET_KEY;
const router = express.Router();

// route(s) 路由規則(們)
// routers (路由物件器)
// 獲取所有使用者
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM `users`;";
    let [users] = await connection.execute(sql);

    res.status(200).json({
      status: "success",
      data: users,
      message: "已 獲取所有使用者",
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 搜尋使用者
router.get("/search", (req, res) => {
  // 網址參數(查詢參數)會被整理到 req 中的 query 裡
  const key = req.query.key;
  res.status(200).json({
    status: "success",
    data: { key },
    message: "搜尋使用者 成功",
  });
});

// 獲取特定 ID 的使用者
router.get("/:id", async (req, res) => {
  // 路由參數
  try {
    const account = req.params.id;
    if (!account) {
      const err = new Error("請提供使用者 ID");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });
    if (!user) {
      const err = new Error("找不到使用者");
      err.code = 404;
      err.status = "fail";
      throw err;
    }

    const { id, password, ...data } = user;

    res.status(200).json({
      status: "success",
      data,
      message: "查詢成功",
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 新增一個使用者
router.post("/", upload.none(), async (req, res) => {
  try {
    // 取得表單中的欄位內容
    const { account, password, mail } = req.body;

    // 檢查必填
    if (!account || !password || !mail) {
      // 設定 Error 物件
      const err = new Error("請提供完整的使用者資訊"); // Error 物件只能在小括號中自訂錯誤訊息
      err.code = 400; // 利用物件的自訂屬性把 HTTP 狀態碼帶到 catch
      err.status = "fail"; // 利用物件的自訂屬性把status字串帶到 catch
      throw err;
    }

    // 檢查 account 有沒有使用過
    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });
    if (user) {
      const err = new Error("提供的註冊內容已被使用1");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    // 檢查 mail 有沒有使用過
    const sqlCheck2 = "SELECT * FROM `users` WHERE `mail` = ?;";
    user = await connection.execute(sqlCheck2, [mail]).then(([result]) => {
      return result[0];
    });
    if (user) {
      const err = new Error("提供的註冊內容已被使用2");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    // 從 randomuser.me 取得一個使用者圖片
    const head = await getRandomAvatar();
    // 把密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立 SQL 語法
    const sql =
      "INSERT INTO `users` (account, password, mail, head) VALUES (?, ?, ?, ?);";
    await connection.execute(sql, [account, hashedPassword, mail, head]);

    res.status(201).json({
      status: "success",
      data: {},
      message: "新增一個使用者 成功",
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "註冊失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 更新(特定 ID 的)使用者
router.put("/:id", checkToken, upload.none(), async (req, res) => {
  try {
    // 取得表單中的欄位內容
    const id = req.params.id;
    const { password, head } = req.body;

    // 檢查至少要有一個欄位有資料
    if (!password && !head) {
      const err = new Error("請提至少提供一個要更新的資料");
      err.code = 400;
      err.status = "fail";
      throw err;
    }
    let updateFields = []; // 用陣列來記錄要更新的欄位
    let values = []; // 用陣列來記錄要更新的欄位的值

    if (password) {
      // 如果有 password 這個欄位
      const hashedPassword = await bcrypt.hash(password, 10); // 加密
      updateFields.push("password = ?"); // 欄位部份的 SQL
      values.push(hashedPassword); // 問號對應的值
    }
    if (head) {
      // 如果有 head 這個欄位
      updateFields.push("head = ?"); // 欄位部份的 SQL
      values.push(head); // 問號對應的值
    }

    values.push(id); // SQL 的最後有用 id 來查詢

    console.log(updateFields);
    console.log(values);

    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE account = ?`;
    const [result] = await connection.execute(sql, values);
    console.log(result);
    if (!result.affectedRows || result.affectedRows != 0) {
      const err = new Error("更新失敗，請洽管理人員");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    res.status(200).json({
      status: "success",
      message: "使用者資料更新成功",
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "註冊失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 刪除(特定 ID 的)使用者
router.delete("/:account", checkToken, async (req, res) => {
  try {
    const { account } = req.params;

    if (req.decoded.account !== account) {
      // 檢查是不是本人
      const err = new Error("你沒有權限刪除此帳號");
      err.code = 403;
      err.status = "fail";
      throw err;
    }

    const result = await connection.execute(
      "DELETE FROM users WHERE account = ?",
      [account]
    );
    console.log(result);
    if (!result.affectedRows || result.affectedRows != 0) {
      const err = new Error("刪除失敗，請洽管理人員");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    res.status(200).json({
      status: "success",
      message: "帳號已成功註銷",
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "註冊失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 使用者登入
router.post("/login", upload.none(), async (req, res) => {
  try {
    const { account, password } = req.body;

    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });

    if (!user) {
      const err = new Error("帳號或密碼錯誤1");
      err.code = 400;
      err.status = "error";
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("帳號或密碼錯誤2");
      err.code = 400;
      err.status = "error";
      throw err;
    }

    const token = jwt.sign(
      {
        account: user.account,
        mail: user.mail,
        head: user.head,
      },
      secretKey,
      { expiresIn: "30m" }
    );

    const newUser = {
      account: user.account,
      mail: user.mail,
      head: user.head,
    }
    
    res.status(200).json({
      status: "success",
      message: "登入成功",
      data: {token, user: newUser},
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登入失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 使用者登出
router.post("/logout", checkToken, async (req, res) => {
  try {
    const { account } = req.decoded;

    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });
    if (!user) {
      const err = new Error("登出失敗");
      err.code = 401;
      err.status = "error";
      throw err;
    }

    const token = jwt.sign(
      {
        message: "過期的token",
      },
      secretKey,
      { expiresIn: "-10s" }
    );
    res.status(200).json({
      status: "success",
      message: "登出成功",
      data: token,
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登出失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 檢查登入狀態
router.post("/status", checkToken, async (req, res) => {
  try {
    const { account } = req.decoded;

    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });
    if (!user) {
      const err = new Error("請登入");
      err.code = 401;
      err.status = "error";
      throw err;
    }

    const token = jwt.sign(
      {
        account: user.account,
        mail: user.mail,
        head: user.head,
      },
      secretKey,
      { expiresIn: "30m" }
    );

    const newUser = {
      account: user.account,
      mail: user.mail,
      head: user.head,
    };

    res.status(200).json({
      status: "success",
      message: "處於登入狀態",
      data: {token, user: newUser},
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

function checkToken(req, res, next) {
  let token = req.get("Authorization");
  if (token && token.includes("Bearer ")) {
    token = token.slice(7);
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.log(error);
        res.status(401).json({
          status: "error",
          message: "登入驗證失效，請重新登入",
        });
        return;
      }
      req.decoded = decoded;
      next();
    });
  } else {
    res.status(401).json({
      status: "error",
      message: "無登入驗證資料，請重新登入",
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
