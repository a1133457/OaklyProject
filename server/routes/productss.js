import express from "express";
import multer from "multer";
import pool from "../connect.js"; 
import { getProductsFromDB } from "./models/products.js";


const upload = multer();
const router = express.Router();

// 獲取所有產品
router.get("/", async (req, res) => {
  try {
    const products = await getProductsFromDB();
    const productMap = new Map();
    products.forEach(item => {
      if (!productMap.has(item.id)) {
        productMap.set(item.id, {
          ...item,
          images: item.img ? [`/uploads/${item.img}`] : []
        });
      } else if (item.img) {
        productMap.get(item.id).images.push(`/uploads/${item.img}`);
      }
    });
    // 轉成陣列回傳
    const productsWithImages = Array.from(productMap.values());
    res.json(productsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "取得商品失敗" });
  }
});



// router.get('/image/:product_id', async (req, res) => {
//   try {
//     const productId = req.params.product_id;

//     const [rows] = await db.query(
//       'SELECT img FROM product_img WHERE product_id = ? LIMIT 1',
//       [productId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).send('圖片不存在');
//     }

//     const imgData = rows[0].img; // BLOB 資料

//     res.set('Content-Type', 'image/jpg'); // 依圖片格式調整
//     res.send(imgData);

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('伺服器錯誤');
//   }
// });



// // 搜尋使用者
// router.get("/search", (req, res)=>{
//   // 網址參數(查詢參數)會被整理到 req 中的 query 裡
//   const key = req.query.key;
//   res.status(200).json({
//     status: "success",
//     data: {key},
//     message: "搜尋使用者 成功"
//   });
// });

// // 獲取特定 ID 的使用者
// router.get("/:id", (req, res)=>{
//   // 路由參數
//   const id = req.params.id;
//   res.status(200).json({
//     status: "success",
//     data: {id},
//     message: `已 獲取 ${id} 的使用者`
//   });
// });

// // 新增一個使用者
// router.post("/", (req, res)=>{
//   res.status(201).json({
//     status: "success",
//     data: {},
//     message: "新增一個使用者 成功"
//   });
// });

// // 更新(特定 ID 的)使用者
// router.put("/:id", (req, res)=>{
//   const id = req.params.id;
//   res.status(200).json({
//     status: "success",
//     data: {id},
//     message: "更新(特定 ID 的)使用者 成功"
//   });
// });

// // 刪除(特定 ID 的)使用者
// router.delete("/:id", (req, res)=>{
//   const id = req.params.id;
//   res.status(200).json({
//     status: "success",
//     data: {id},
//     message: "刪除(特定 ID 的)使用者 成功"
//   });
// });



// 使用者登入
router.post("/login", upload.none(), (req, res)=>{
  const {account, password} = req.body;
  res.status(200).json({
    status: "success",
    data: "token",
    message: `使用者${account}登入 成功`
  });
});

// 使用者登出
router.post("/logout", checkToken, (req, res)=>{
  res.status(200).json({
    status: "success",
    data: "token",
    message: "使用者登出 成功"
  });
});

// 檢查登入狀態
router.post("/status", checkToken, (req, res)=>{
  res.status(200).json({
    status: "success",
    data: "token",
    message: "檢查登入狀態 成功"
  });
});

function checkToken(req, res, next){
  next();
}

export default router;