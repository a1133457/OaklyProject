import express from "express";
import db from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// JWT 中間件
const authenticateAgent = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '需要認證token' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.agent = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'token無效' });
  }
};

// 創建資料庫表格的 SQL
const createTablesSQL = `
  CREATE TABLE IF NOT EXISTS service_agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    status ENUM('online', 'busy', 'offline') DEFAULT 'offline',
    max_chats INT DEFAULT 3,
    current_chats INT DEFAULT 0,
    department VARCHAR(50) DEFAULT '一般客服',
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS service_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    agent_id INT,
    status ENUM('waiting', 'active', 'ended') DEFAULT 'waiting',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS service_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_type ENUM('customer', 'agent', 'system') NOT NULL,
    sender_id INT,
    sender_name VARCHAR(100),
    message TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file') DEFAULT 'text',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conversation_id) REFERENCES service_conversations(id) ON DELETE CASCADE
  );

  INSERT IGNORE INTO service_agents (username, password, name, email, department) VALUES
  ('alice', '123456', '愛麗絲', 'alice@oakly.com', '一般客服'),
  ('bob', '123456', '鮑伯', 'bob@oakly.com', '技術支援');
`;

// 初始化資料庫表格
const initializeTables = async () => {
  try {
    await db.execute(createTablesSQL);
    console.log('客服資料表初始化完成');
  } catch (error) {
    console.error('初始化資料表失敗:', error);
  }
};

// 執行初始化
initializeTables();

// ===== 客服 API 路由 =====

// 客服登入
router.post('/agent/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.execute(
      'SELECT * FROM service_agents WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: '帳號不存在' });
    }

    const agent = rows[0];
    
    // 驗證密碼（預設密碼是 123456）
    const isValidPassword = password === '123456' || await bcrypt.compare(password, agent.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: '密碼錯誤' });
    }

    // 更新客服狀態為線上
    await db.execute(
      'UPDATE service_agents SET status = "online", updated_at = NOW() WHERE id = ?',
      [agent.id]
    );

    const token = jwt.sign(
      { id: agent.id, username: agent.username, type: 'agent' },
      'your-secret-key',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      agent: {
        id: agent.id,
        name: agent.name,
        department: agent.department,
        status: 'online'
      }
    });

  } catch (error) {
    console.error('客服登入錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 獲取客服對話列表
router.get('/agent/conversations', authenticateAgent, async (req, res) => {
  try {
    const [conversations] = await db.execute(`
      SELECT 
        c.*,
        (SELECT message FROM service_messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message,
        (SELECT sent_at FROM service_messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message_time
      FROM service_conversations c 
      WHERE c.agent_id = ? AND c.status IN ('active', 'waiting')
      ORDER BY c.updated_at DESC
    `, [req.agent.id]);

    res.json({
      success: true,
      conversations: conversations
    });

  } catch (error) {
    console.error('獲取對話列表錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 獲取等待佇列
router.get('/agent/queue', authenticateAgent, async (req, res) => {
  try {
    const [waiting] = await db.execute(`
      SELECT 
        c.*,
        TIMESTAMPDIFF(MINUTE, c.started_at, NOW()) as waiting_minutes,
        (SELECT message FROM service_messages WHERE conversation_id = c.id ORDER BY sent_at ASC LIMIT 1) as first_message
      FROM service_conversations c 
      WHERE c.status = 'waiting' AND c.agent_id IS NULL
      ORDER BY c.started_at ASC
    `);

    res.json({
      success: true,
      queue: waiting
    });

  } catch (error) {
    console.error('獲取等待佇列錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 接取等待中的對話
router.post('/agent/take/:conversationId', authenticateAgent, async (req, res) => {
  try {
    const { conversationId } = req.params;

    // 檢查客服當前對話數
    const [agentInfo] = await db.execute(
      'SELECT current_chats, max_chats FROM service_agents WHERE id = ?',
      [req.agent.id]
    );

    if (agentInfo.length === 0) {
      return res.status(404).json({ error: '客服不存在' });
    }

    if (agentInfo[0].current_chats >= agentInfo[0].max_chats) {
      return res.status(400).json({ error: '已達最大對話數限制' });
    }

    // 更新對話狀態
    const [result] = await db.execute(
      'UPDATE service_conversations SET agent_id = ?, status = "active", updated_at = NOW() WHERE id = ? AND status = "waiting"',
      [req.agent.id, conversationId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: '對話不存在或已被處理' });
    }

    // 增加客服當前對話數
    await db.execute(
      'UPDATE service_agents SET current_chats = current_chats + 1 WHERE id = ?',
      [req.agent.id]
    );

    // 添加系統訊息
    await db.execute(
      'INSERT INTO service_messages (conversation_id, sender_type, sender_name, message) VALUES (?, "system", "系統", "客服已為您服務")',
      [conversationId]
    );

    res.json({
      success: true,
      message: '成功接取對話'
    });

  } catch (error) {
    console.error('接取對話錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// ===== 客戶 API 路由 =====

// 客戶開始對話
router.post('/customer/start', async (req, res) => {
  console.log('請求數據:', req.body);

  try {
    const { customerName, customerEmail, initialMessage, userId } = req.body;

    // 尋找可用的客服
    const [availableAgents] = await db.execute(`
      SELECT id, name, current_chats, max_chats 
      FROM service_agents 
      WHERE status = 'online' AND current_chats < max_chats 
      ORDER BY current_chats ASC 
      LIMIT 1
    `);

    let agentId = null;
    let status = 'waiting';

    if (availableAgents.length > 0) {
      agentId = availableAgents[0].id;
      status = 'active';
    }

    // 創建對話
    const [conversationResult] = await db.execute(
      'INSERT INTO service_conversations (customer_id, customer_name, customer_email, agent_id, status) VALUES (?, ?, ?, ?, ?)',
      [userId || null, customerName, customerEmail, agentId, status]
    );

    const conversationId = conversationResult.insertId;

    // 添加初始訊息
    if (initialMessage) {
      await db.execute(
        'INSERT INTO service_messages (conversation_id, sender_type, sender_id, sender_name, message) VALUES (?, "customer", ?, ?, ?)',
        [conversationId, userId || null, customerName, initialMessage]
      );
    }

    // 如果有可用客服，增加其對話數
    if (agentId) {
      await db.execute(
        'UPDATE service_agents SET current_chats = current_chats + 1 WHERE id = ?',
        [agentId]
      );

      // 添加系統歡迎訊息
      await db.execute(
        'INSERT INTO service_messages (conversation_id, sender_type, sender_name, message) VALUES (?, "system", "系統", ?)',
        [conversationId, `${availableAgents[0].name} 為您服務，請問有什麼可以幫助您的嗎？`]
      );
    } else {
      // 添加等待訊息
      await db.execute(
        'INSERT INTO service_messages (conversation_id, sender_type, sender_name, message) VALUES (?, "system", "系統", "目前客服繁忙，您已進入等待佇列，我們會盡快為您服務")',
        [conversationId]
      );
    }

    res.json({
      success: true,
      conversationId,
      status,
      message: agentId ? '已為您安排客服人員' : '已進入等待佇列'
    });

  } catch (error) {
    console.error('開始對話錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 發送訊息
router.post('/message/send', async (req, res) => {
  try {
    const { conversationId, message, senderType, senderId, senderName } = req.body;

    // 插入訊息
    await db.execute(
      'INSERT INTO service_messages (conversation_id, sender_type, sender_id, sender_name, message) VALUES (?, ?, ?, ?, ?)',
      [conversationId, senderType, senderId, senderName, message]
    );

    // 更新對話時間
    await db.execute(
      'UPDATE service_conversations SET updated_at = NOW() WHERE id = ?',
      [conversationId]
    );

    res.json({
      success: true,
      message: '訊息發送成功'
    });

  } catch (error) {
    console.error('發送訊息錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 獲取對話訊息
router.get('/conversation/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;

    const [messages] = await db.execute(
      'SELECT * FROM service_messages WHERE conversation_id = ? ORDER BY sent_at ASC',
      [id]
    );

    const [conversation] = await db.execute(
      'SELECT c.*, a.name as agent_name FROM service_conversations c LEFT JOIN service_agents a ON c.agent_id = a.id WHERE c.id = ?',
      [id]
    );

    res.json({
      success: true,
      conversation: conversation[0] || null,
      messages
    });

  } catch (error) {
    console.error('獲取訊息錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 結束對話
router.post('/conversation/:id/end', authenticateAgent, async (req, res) => {
  try {
    const { id } = req.params;

    // 更新對話狀態
    await db.execute(
      'UPDATE service_conversations SET status = "ended", ended_at = NOW() WHERE id = ? AND agent_id = ?',
      [id, req.agent.id]
    );

    // 減少客服對話數
    await db.execute(
      'UPDATE service_agents SET current_chats = GREATEST(0, current_chats - 1) WHERE id = ?',
      [req.agent.id]
    );

    // 添加結束訊息
    await db.execute(
      'INSERT INTO service_messages (conversation_id, sender_type, sender_name, message) VALUES (?, "system", "系統", "對話已結束，感謝您的使用")',
      [id]
    );

    res.json({
      success: true,
      message: '對話已結束'
    });

  } catch (error) {
    console.error('結束對話錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 輪詢獲取新訊息
router.get('/conversation/:id/poll', async (req, res) => {
  try {
    const { id } = req.params;
    const { lastMessageId = 0 } = req.query;

    const [newMessages] = await db.execute(
      'SELECT * FROM service_messages WHERE conversation_id = ? AND id > ? ORDER BY sent_at ASC',
      [id, lastMessageId]
    );

    res.json({
      success: true,
      messages: newMessages
    });

  } catch (error) {
    console.error('輪詢訊息錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;