import express from 'express';
import db from '../connect.js';

const router = express.Router();

router.get('/products/:productId/reviews', async (req, res) => {
  const { productId } = req.params;
  try {
    const [reviews] = await db.execute(
      'SELECT id, user_name, email, rating, comment, avatar, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
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
    const { user_id,user_name, email, rating, comment, product_id, avatar } = req.body;
    
    if (!user_id ||!user_name || !email || !rating || !comment || !product_id) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要欄位'
      });
    }

    const sql = `
    INSERT INTO reviews (user_id,user_name, email, rating, comment, product_id, avatar)
    VALUES (? ,?, ?, ?, ?, ?, ?)
  `;

  

  const [result] = await db.query(sql, [
    user_id,
    user_name,
    email,
    rating,
    comment,
    product_id,
    avatar
  ]);

  res.json({
    status: 'success',
    message: '評論新增成功',
    insertId: result.insertId,
    data: { user_id, user_name, email, rating, comment, product_id, avatar }  
  });
} catch (err) {
  console.error('新增評論失敗:', err);
  res.status(500).json({
    status: 'error',
    message: '伺服器錯誤，新增評論失敗',
    error: err.message
  }); }
});
    

export default router;