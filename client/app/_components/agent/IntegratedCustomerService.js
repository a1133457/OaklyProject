"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

const IntegratedCustomerService = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [conversationStatus, setConversationStatus] = useState('not_started');
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
  const [showStartForm, setShowStartForm] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(0);
  const [agentName, setAgentName] = useState('');
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  // 自動回覆系統（備用）
  const autoReplies = {
    '配送': '我們提供全台免費配送服務，一般3-5個工作日送達。',
    '退貨': '商品收到後7天內可申請退貨，傢俱類商品需保持原包裝完整。',
    '保固': '所有商品提供1年保固服務，實木傢俱提供2年保固。',
    '材質': '我們的傢俱主要使用環保材質，包括實木、環保板材等。',
    '安裝': '大型傢俱提供免費安裝服務，小型商品附有詳細安裝說明書。',
    '付款': '支援信用卡、ATM轉帳、貨到付款等多種付款方式。'
  };

  const quickQuestions = [
    '配送需要多久？',
    '如何申請退貨？',
    '保固期多長？',
    '有安裝服務嗎？',
    '付款方式有哪些？',
    '營業時間？'
  ];

  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.username || user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 開始輪詢新訊息
  useEffect(() => {
    if (conversationId && (conversationStatus === 'active' || conversationStatus === 'waiting')) {
      pollInterval.current = setInterval(() => {
        pollNewMessages();
      }, 2000);

      return () => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
      };
    }
  }, [conversationId, conversationStatus, lastMessageId]);

  const pollNewMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/service/conversation/${conversationId}/poll?lastMessageId=${lastMessageId}`);
      const data = await response.json();
  
      if (data.success && data.messages.length > 0) {
        const newMessages = data.messages
          .filter(msg => {
            // 過濾掉客戶自己發送的訊息，避免重複顯示
            if (msg.sender_type === 'customer' && msg.sender_id === (user?.id || null)) {
              return false;
            }
            return true;
          })
          .map(msg => ({
            id: msg.id,
            text: msg.message,
            sender: msg.sender_type,
            senderName: msg.sender_name,
            timestamp: new Date(msg.sent_at)
          }));
  
        if (newMessages.length > 0) {
          setMessages(prev => [...prev, ...newMessages]);
        }
        
        // 無論是否有新訊息要顯示，都要更新 lastMessageId
        setLastMessageId(data.messages[data.messages.length - 1].id);
  
        const agentMessage = newMessages.find(msg => msg.sender === 'agent');
        if (agentMessage && conversationStatus === 'waiting') {
          setConversationStatus('active');
          setAgentName(agentMessage.senderName);
        }
      }
    } catch (error) {
      console.error('輪詢訊息失敗:', error);
    }
  };
  const startChat = async () => {
    if (!customerInfo.name.trim()) {
      alert('請輸入您的姓名');
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/api/service/customer/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          initialMessage: newMessage || '您好，我需要客服協助',
          userId: user?.id || null
        })
      });

      const data = await response.json();

      if (data.success) {
        setConversationId(data.conversationId);
        setConversationStatus(data.status);
        setShowStartForm(false);
        setNewMessage('');

        loadConversationMessages(data.conversationId);
       
      } else {
        setConversationStatus('auto_reply');
        addLocalMessage('目前客服繁忙，為您啟動智能客服', 'system');
        setShowStartForm(false);
      }
    } catch (error) {
      console.error('啟動客服失敗:', error);
      setConversationStatus('auto_reply');
      addLocalMessage('連接客服系統失敗，為您啟動智能客服', 'system');
      setShowStartForm(false);
    }
  };

  const loadConversationMessages = async (convId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/service/conversation/${convId}/messages`);
      const data = await response.json();

      if (data.success) {
        const formattedMessages = data.messages.map(msg => ({
          id: msg.id,
          text: msg.message,
          sender: msg.sender_type,
          senderName: msg.sender_name,
          timestamp: new Date(msg.sent_at)
        }));

        setMessages(formattedMessages);
        if (formattedMessages.length > 0) {
          setLastMessageId(formattedMessages[formattedMessages.length - 1].id);
        }

        if (data.conversation && data.conversation.agent_name) {
          setAgentName(data.conversation.agent_name);
        }
      }
    } catch (error) {
      console.error('載入對話失敗:', error);
    }
  };

 
const sendMessage = async () => {
  if (!newMessage.trim()) return;

  const userMessage = newMessage;
  setNewMessage('');
  
  // 先在本地添加客戶訊息
  addLocalMessage(userMessage, 'user');

  if (conversationStatus === 'active' || conversationStatus === 'waiting') {
    try {
      await fetch('http://localhost:3005/api/service/message/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
          senderType: 'customer',
          senderId: user?.id || null,
          senderName: customerInfo.name
        })
      });
    } catch (error) {
      console.error('發送訊息失敗:', error);
      addLocalMessage('訊息發送失敗，請重試', 'system');
    }
  } else if (conversationStatus === 'auto_reply') {
    // 自動回覆模式（訊息已經在上面添加了）
    setTimeout(() => {
      const reply = getAutoReply(userMessage);
      addLocalMessage(reply, 'agent', '智能客服');
    }, 1000 + Math.random() * 2000);
  }
};

  const addLocalMessage = (text, sender, senderName = '') => {
    const message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      senderName,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const getAutoReply = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    for (const [keyword, reply] of Object.entries(autoReplies)) {
      if (message.includes(keyword.toLowerCase())) {
        return reply;
      }
    }
    
    if (message.includes('你好') || message.includes('哈囉')) {
      return '您好！歡迎來到 Oakly 傢俱智能客服，請問有什麼可以幫助您的嗎？';
    }
    
    return '感謝您的諮詢！如需要人工服務，請在營業時間重新開啟客服。客服專線：0800-123-456';
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && conversationStatus === 'not_started') {
      setShowStartForm(true);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* 聊天窗口 */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '320px',
          height: '400px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          border: '1px solid #e5e5e5',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* 標題欄 */}
          <div style={{
            background: 'linear-gradient(135deg, #DBA783, #C89665)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Oakly 客服</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {conversationStatus === 'active' ? `${agentName || '客服'} 為您服務` : 
                 conversationStatus === 'waiting' ? '等待客服中...' : '線上客服'}
              </div>
            </div>
            <button 
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          {/* 訊息區域 */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}>
            {showStartForm && conversationStatus === 'not_started' && (
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="您的姓名"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
                <input
                  type="email"
                  placeholder="電子郵件 (選填)"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={startChat}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#DBA783',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  開始對話
                </button>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: message.sender === 'user' ? '#DBA783' : 
                                   message.sender === 'system' ? '#e3f2fd' : 'white',
                  color: message.sender === 'user' ? 'white' : '#333',
                  border: message.sender !== 'user' ? '1px solid #eee' : 'none'
                }}>
                  <div>{message.text}</div>
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    marginTop: '5px'
                  }}>
                    {message.senderName && `${message.senderName} • `}
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 快速問題 */}
          {(conversationStatus === 'waiting' || messages.length <= 2) && (
            <div style={{ padding: '10px', borderTop: '1px solid #eee', backgroundColor: 'white' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>常見問題：</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setNewMessage(question);
                      setTimeout(sendMessage, 100);
                    }}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #ddd',
                      borderRadius: '15px',
                      cursor: 'pointer'
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 輸入區域 */}
          {conversationStatus !== 'not_started' && (
            <div style={{ 
              padding: '15px', 
              borderTop: '1px solid #eee', 
              backgroundColor: 'white',
              borderRadius: '0 0 10px 10px'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="輸入您的問題..."
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#DBA783',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  送出
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 聊天按鈕 */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#DBA783',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 999,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </>
  );
};

export default IntegratedCustomerService;