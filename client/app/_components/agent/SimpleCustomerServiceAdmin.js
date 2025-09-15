"use client"

import React, { useState, useEffect, useRef } from 'react';

const SimpleCustomerServiceAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [agent, setAgent] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [waitingQueue, setWaitingQueue] = useState([]);
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  // 客服登入
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3005/api/service/agent/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('agentToken', data.token);
        setAgent(data.agent);
        setIsLoggedIn(true);
        startPolling();
      } else {
        alert('登入失敗：' + (data.error || '請檢查帳號密碼'));
      }
    } catch (error) {
      console.error('登入錯誤:', error);
      alert('登入失敗，請檢查網路連接');
    }
  };

  const startPolling = () => {
    fetchConversations();
    fetchWaitingQueue();
    pollInterval.current = setInterval(() => {
      fetchConversations();
      fetchWaitingQueue();
      if (activeConversation) {
        fetchMessages(activeConversation.id);
      }
    }, 3000);
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('agentToken');
      const response = await fetch('http://localhost:3005/api/service/agent/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('獲取對話列表失敗:', error);
    }
  };

  const fetchWaitingQueue = async () => {
    try {
      const token = localStorage.getItem('agentToken');
      const response = await fetch('http://localhost:3005/api/service/agent/queue', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setWaitingQueue(data.queue || []);
      }
    } catch (error) {
      console.error('獲取等待佇列失敗:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/service/conversation/${conversationId}/messages`);
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
      }
    } catch (error) {
      console.error('獲取訊息失敗:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    try {
      await fetch('http://localhost:3005/api/service/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          message: newMessage,
          senderType: 'agent',
          senderId: agent.id,
          senderName: agent.name
        })
      });

      setNewMessage('');
      setTimeout(() => fetchMessages(activeConversation.id), 500);
    } catch (error) {
      console.error('發送訊息失敗:', error);
    }
  };

  const takeConversation = async (conversationId) => {
    try {
      const token = localStorage.getItem('agentToken');
      const response = await fetch(`http://localhost:3005/api/service/agent/take/${conversationId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchConversations();
        fetchWaitingQueue();
        alert('成功接取對話');
      }
    } catch (error) {
      console.error('接取對話失敗:', error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>客服管理系統</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>帳號</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
                placeholder="alice 或 bob"
                required
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>密碼</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
                placeholder="123456"
                required
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '15px', backgroundColor: '#DBA783', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              登入
            </button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
            <p>測試帳號: alice 或 bob</p>
            <p>密碼: 123456</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* 頂部導航 */}
      <div style={{ backgroundColor: 'white', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Oakly 客服管理系統</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#666' }}>{agent?.name} - 線上</span>
          <button
            onClick={() => {
              localStorage.removeItem('agentToken');
              window.location.reload();
            }}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            登出
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* 左側邊欄 */}
        <div style={{ width: '300px', backgroundColor: 'white', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          {/* 等待佇列 */}
          {waitingQueue.length > 0 && (
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: '#fff3cd' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#856404' }}>等待佇列 ({waitingQueue.length})</h3>
              {waitingQueue.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '5px', marginBottom: '10px', border: '1px solid #ffeaa7' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.customer_name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>等待 {item.waiting_minutes} 分鐘</div>
                  </div>
                  <button
                    onClick={() => takeConversation(item.id)}
                    style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    接取
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 對話列表 */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>進行中的對話 ({conversations.length})</h3>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setActiveConversation(conversation);
                  fetchMessages(conversation.id);
                }}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  border: '1px solid #eee',
                  cursor: 'pointer',
                  backgroundColor: activeConversation?.id === conversation.id ? '#e3f2fd' : '#f8f9fa',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{conversation.customer_name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {conversation.status === 'active' ? '進行中' : '等待中'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 主要聊天區域 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeConversation ? (
            <>
              {/* 聊天標題 */}
              <div style={{ padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0 }}>{activeConversation.customer_name}</h2>
                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>對話 ID: {activeConversation.id}</p>
                </div>
                <button
                  onClick={() => fetchMessages(activeConversation.id)}
                  style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  重新整理
                </button>
              </div>

              {/* 訊息區域 */}
              <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa', overflowY: 'auto' }}>
                {messages.map((message) => (
                  <div key={message.id} style={{ display: 'flex', justifyContent: message.sender === 'agent' ? 'flex-end' : 'flex-start', marginBottom: '15px' }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px',
                      borderRadius: '10px',
                      backgroundColor: message.sender === 'agent' ? '#007bff' : message.sender === 'system' ? '#ffc107' : 'white',
                      color: message.sender === 'agent' ? 'white' : message.sender === 'system' ? '#856404' : '#333',
                      border: message.sender === 'customer' ? '1px solid #eee' : 'none'
                    }}>
                      <div style={{ marginBottom: '5px' }}>{message.text}</div>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>
                        {message.senderName} • {new Date(message.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* 輸入區域 */}
              <div style={{ padding: '20px', backgroundColor: 'white', borderTop: '1px solid #eee' }}>
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
                    placeholder="輸入回覆訊息..."
                    style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                  >
                    送出
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
              <div style={{ textAlign: 'center', color: '#666' }}>
                <h3>選擇一個對話開始</h3>
                <p>從左側選擇客戶對話或接取等待中的諮詢</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCustomerServiceAdmin;