import express from 'express';
import nodemailer from 'nodemailer';
import db from "../connect.js";

const router = express.Router();

// 設定郵件發送器
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'oakly.service@gmail.com', // 替換成你的 Gmail
    pass: 'dcxufxhscfgyydyp'     // 替換成你的應用程式密碼
  }
});

// 到貨通知 API
router.post('/stock', async (req, res) => {
  try {
    const { productId, colorId, sizeId, email, userId } = req.body;
    
    if (!productId || !colorId || !sizeId || !email || !userId) {
      return res.status(400).json({
        status: 'error',
        message: '請提供完整的通知資訊'
      });
    }
    
    // 存到資料庫
    await db.execute(
      'INSERT INTO stock_notifications (user_id, product_id, color_id, size_id, email, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, productId, colorId, sizeId, email]
    );
    
    // 發送郵件
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: '【Oakly】到貨通知設定成功',
      html: '<h2>設定成功！商品到貨時會通知您</h2>'
    });
    
    res.json({
      status: 'success',
      message: '到貨通知設定成功'
    });
    
  } catch (error) {
    console.error('設定到貨通知失敗:', error);
    res.status(500).json({
      status: 'error',
      message: '設定到貨通知時發生錯誤'
    });
  }
});

export default router;