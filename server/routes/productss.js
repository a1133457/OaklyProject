import express from "express";
import multer from "multer";
import db from "../connect.js";
import { getProductsFromDB } from "./models/products.js";


const upload = multer();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    console.log('收到的 category 參數:', category);

    let products;

    if (category) {
      const query = `
        SELECT 
          p.*,
          pc.category_name,
          pi.img
        FROM products p
        LEFT JOIN products_category pc ON p.category_id = pc.category_id
        LEFT JOIN product_img pi ON p.id = pi.product_id
        WHERE pc.category_name LIKE ? AND p.is_valid = 1
      `;

      try {
        const [rows] = await db.execute(query, [`%${category}%`]);
        console.log('分類查詢結果數量:', rows.length);
        products = rows;
      } catch (dbError) {
        console.error('資料庫查詢錯誤:', dbError);
        throw dbError;
      }
    } else {
      products = await getProductsFromDB();
    }

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

    const productsWithImages = Array.from(productMap.values());
    console.log('最終回傳產品數量:', productsWithImages.length);
    res.json(productsWithImages);

  } catch (error) {
    console.error('詳細錯誤訊息:', error);
    res.status(500).json({
      message: "取得商品失敗",
      error: error.message
    });
  }
});


router.get("/search", async (req, res) => {
  let { q, page = 1, limit = 10 } = req.query;

  console.log("搜尋API被呼叫:", { q, page, limit });

  q = q ? q.trim() : "";
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (!q) {
    return res.status(400).json({ status: "error", message: "查詢字串不可為空" });
  }

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  try {
    // 直接使用現有的 getProductsFromDB 函數
    const allProducts = await getProductsFromDB();

    const productMap = new Map();
    allProducts.forEach(item => {
      if (!productMap.has(item.id)) {
        productMap.set(item.id, {
          ...item,
          images: item.img ? [`/uploads/${item.img}`] : []
        });
      } else if (item.img) {
        productMap.get(item.id).images.push(`/uploads/${item.img}`);
      }
    });

    const productsWithImages = Array.from(productMap.values());

    //搜尋篩選
    const filteredProducts = productsWithImages.filter(product => {
      // ID 搜尋
      if (/^\d+$/.test(q)) {
        return product.id == q;
      }
      // 名稱模糊搜尋
      return product.name.toLowerCase().includes(q.toLowerCase());
    });

    // 排序：開頭匹配優先
    filteredProducts.sort((a, b) => {
      const aStartsWith = a.name.toLowerCase().startsWith(q.toLowerCase());
      const bStartsWith = b.name.toLowerCase().startsWith(q.toLowerCase());

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.name.localeCompare(b.name);
    });

    // 分頁處理
    const offset = (page - 1) * limit;
    const paginatedResults = filteredProducts.slice(offset, offset + limit);

    console.log(`搜尋 "${q}" 找到 ${filteredProducts.length} 個結果`);


    if (paginatedResults.length > 0) {
      console.log("找到的產品:", paginatedResults.map(r => r.name));
    }
    
    const latestQuery = `
  SELECT id FROM products 
  WHERE is_valid = 1 
  ORDER BY create_at DESC 
  LIMIT 50
`;
    const [latestProducts] = await db.execute(latestQuery);
    const latestProductIds = latestProducts.map(p => p.id);

    const resultsWithBadges = paginatedResults.map(product => {
      const isNew = latestProductIds.includes(product.id);
      const isHot = product.quantity <= 20 && product.quantity > 0;

      return {
        ...product,
        isNew,
        isHot
      };
    });
    res.json({
      status: "success",
      data: resultsWithBadges,
      pagination: {
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
    });

  } catch (err) {
    console.error("搜尋錯誤:", err);
    res.status(500).json({ status: "error", message: "伺服器錯誤" });
  }
});


//  最新商品
router.get('/latest', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // 加入圖片查詢
    const query = `
      SELECT 
        p.*,
        pi.img
      FROM products p
      LEFT JOIN product_img pi ON p.id = pi.product_id
       WHERE p.is_valid = 1
      ORDER BY p.create_at DESC 
      LIMIT ?
    `;

    const [products] = await db.execute(query, [parseInt(limit)]);

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

    const productsWithImages = Array.from(productMap.values());

    res.json(productsWithImages);

  } catch (error) {
    console.error('獲取最新商品失敗:', error);
    res.status(500).json({
      status: 'error',
      message: '獲取最新商品失敗'
    });
  }
});

// 熱賣商品
router.get('/hot-products', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // 簡單查詢：quantity ≤ 20 的商品
    const query = `
      SELECT 
        p.*,
        pi.img
      FROM products p
      LEFT JOIN product_img pi ON p.id = pi.product_id
      WHERE p.quantity <= 20 
        AND p.quantity > 0
        AND p.is_valid = 1
      ORDER BY p.quantity ASC
      LIMIT ?
    `;

    const [products] = await db.execute(query, [parseInt(limit)]);

    // 使用你現有的圖片處理邏輯
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

    const productsWithImages = Array.from(productMap.values());

    res.json(productsWithImages);

  } catch (error) {
    console.error('獲取熱賣商品失敗:', error);
    res.status(500).json({
      status: 'error',
      message: '獲取熱賣商品失敗'
    });
  }
});

//  產品詳細資料
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
      LEFT JOIN designers d ON p.designers_id = d.id
      LEFT JOIN product_img pi ON p.id = pi.product_id
      WHERE p.id = ? AND p.is_valid = 1
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



export default router;