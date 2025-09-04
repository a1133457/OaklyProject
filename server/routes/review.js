import express from 'express';
import db from '../connect.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 確保上傳目錄存在
const uploadDir = path.join(__dirname, '../public/uploads/reviews');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// 設定 multer 存儲
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一檔名: 時間戳-隨機數-原檔名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'review-' + uniqueSuffix + ext);
  }
});

// 檔案過濾器
const fileFilter = (req, file, cb) => {
  // 只允許圖片類型
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允許上傳圖片檔案'), false);
  }
};

// multer 設定
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 限制
    files: 5 // 最多 5 張圖片
  }
});

// 圖片上傳 API
router.post('/upload/review-images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '沒有上傳任何檔案'
      });
    }

    // 回傳圖片 URLs
    const imageUrls = req.files.map(file => {
      return '/uploads/reviews/' + file.filename;
    });

    res.json({
      status: 'success',
      message: '圖片上傳成功',
      imageUrls: imageUrls
    });

  } catch (error) {
    console.error('圖片上傳錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '圖片上傳失敗'
    });
  }
});


router.get('/products/:productId/reviews', async (req, res) => {
  const { productId } = req.params;
  try {
    const [reviews] = await db.execute(
      'SELECT id, user_name, email, rating, comment, avatar, reviews_img, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
    res.json({ status: 'success', data: reviews });
  } catch (err) {
    console.error('獲取評論失敗:', err);
    res.status(500).json({ status: 'error', message: '獲取評論失敗' });
  }
});

router.post('/reviews', async(req, res) => {
  console.log('req.body 存在嗎?', !!req.body);
  console.log('req.body 內容:', req.body);
  console.log('req.body 類型:', typeof req.body);
  
  if (!req.body) {
    return res.status(400).json({
      status: 'error',
      message: 'req.body is undefined'
    });
  }
  
  try {
    const { user_id, user_name, email, rating, comment, product_id, avatar, reviews_img } = req.body;
    
    if (!user_id ||!user_name || !email || !rating || !comment || !product_id) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要欄位'
      });
    }

    const sql = `
      INSERT INTO reviews (user_id, user_name, email, rating, comment, product_id, avatar, reviews_img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  

  const [result] = await db.query(sql, [
    user_id,
    user_name,
    email,
    rating,
    comment,
    product_id,
    avatar,
    reviews_img || null // 如果沒有圖片就存 null

  ]);

  res.json({
    status: 'success',
    message: '評論新增成功',
    insertId: result.insertId,
    data: { user_id, user_name, email, rating, comment, product_id, avatar, reviews_img }
  });
} catch (err) {
  console.error('新增評論失敗:', err);
  res.status(500).json({
    status: 'error',
    message: '伺服器錯誤，新增評論失敗',
    error: err.message
  }); }
});

// 處理 multer 錯誤的中間件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: '檔案大小超過限制 (5MB)'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: '檔案數量超過限制 (最多5張)'
      });
    }
  }
  
  res.status(400).json({
    status: 'error',
    message: error.message || '上傳錯誤'
  });
});
    

export default router;