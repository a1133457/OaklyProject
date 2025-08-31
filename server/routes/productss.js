import express from "express";
import multer from "multer";
import db from "../connect.js";
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

//  獲取產品詳細資料
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // 驗證ID是否為有效數字
    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "無效的產品ID"
      });
    }

    // 獲取產品基本信息
    const productQuery = `
      SELECT 
        p.*,
        d.name as designer_name,
        pi.img
      FROM products p
      LEFT JOIN designers d ON p.designer_id = d.id
      LEFT JOIN product_img pi ON p.id = pi.product_id
      WHERE p.id = ?
      LIMIT 1
    `;
    const imagesQuery = `
    SELECT 
      id,
      img
    FROM product_img 
    WHERE product_id = ?
    ORDER BY id ASC
  `;

    // 獲取產品顏色
    const colorsQuery = `
      SELECT 
        c.id,
        c.color_name
      FROM colors c
      JOIN product_colors pc ON c.id = pc.color_id
      WHERE pc.product_id = ?
    `;

    // 獲取產品尺寸
    const sizesQuery = `
      SELECT 
        s.id,
        s.size_label
      FROM sizes s
      JOIN product_sizes ps ON s.id = ps.size_id
      WHERE ps.product_id = ?
    `;

    // 獲取產品材質
    const materialsQuery = `
      SELECT 
        m.id,
        m.material_name
      FROM materials m
      JOIN materials_list ml ON m.id = ml.materials_id
      WHERE ml.product_id = ?
    `;

    // 獲取庫存信息
    const stockQuery = `
      SELECT 
        s.color_id,
        s.size_id,
        s.amount,
        c.color_name,
        sz.size_label
      FROM stocks s
      JOIN colors c ON s.color_id = c.id
      JOIN sizes sz ON s.size_id = sz.id
      WHERE s.id = ? AND s.amount > 0
    `;

    // 執行所有查詢
    const [productResult] = await db.execute(productQuery, [id]);

    if (productResult.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到指定的產品"
      });
    }

    const [imagesResult] = await db.execute(imagesQuery, [id]);
    const [colorsResult] = await db.execute(colorsQuery, [id]);
    const [sizesResult] = await db.execute(sizesQuery, [id]);
    const [materialsResult] = await db.execute(materialsQuery, [id]);
    const [stockResult] = await db.execute(stockQuery, [id]);

    const productImages = imagesResult.map((img, index) => {
      return {
        id: img.id,
        url: `/uploads/${img.img}`,
        isMain: index === 0, // 第一張當主圖
        sortOrder: index
      };
    });



    // 整理庫存數據
    const stockInfo = stockResult.map(stock => ({
      color_id: stock.color_id,
      size_id: stock.size_id,
      color_name: stock.color_name,
      size_label: stock.size_label,
      amount: stock.amount
    }));

    // 計算總庫存
    const totalStock = stockResult.reduce((total, stock) => total + stock.amount, 0);

    const productData = {
      ...productResult[0],
      images: productImages,
      colors: colorsResult,
      sizes: sizesResult,
      materials: materialsResult,
      stock: {
        total: totalStock,
        details: stockInfo
      }
    };

    res.status(200).json({
      status: "success",
      data: productData,
      message: `已獲取產品 ${id} 的詳細資料`
    });

  } catch (error) {
    console.error("獲取產品資料時發生錯誤:", error);
    res.status(500).json({
      status: "error",
      message: "服務器內部錯誤"
    });
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




export default router;