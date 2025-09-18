'use client'

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '@/hooks/use-auth';
import "@/styles/products/chat.css";

const CustomerChat = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStatus, setChatStatus] = useState('offline'); // offline, waiting, active
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 模擬用戶資料（實際應用中從認證系統獲取）
  // const userData = {
  //   userId: 1,
  //   userName: 'John Doe'
  // };


  const { user, isLoading } = useAuth();

  // 檢查用戶是否已登入
  const isLoggedIn = !!user;
  const loading = isLoading;

  // 準備用戶資料
  const userData = isLoggedIn ? {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    isAuthenticated: true
  } : {
    userId: null,
    userName: '訪客',
    userEmail: null,
    isAuthenticated: false
  };


  useEffect(() => {
    if (isLoading) {
      console.log('用戶資料載入中，等待...');
      return;
    }

    if (socket && socket.connected) {
      console.log('Socket 已連接，跳過重複連接');
      return;
    }

    // 等待更長時間確保所有狀態穩定
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('延遲檢查時仍在載入，取消連接');
        return;
      }



      // 取得並驗證 token
      const token = localStorage.getItem('reactLoginToken');

      // 建立 socket 連接選項
      const socketOptions = {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true, // 強制建立新連接避免快取問題
      };

      // 準備用戶資料（這是關鍵！）
      let finalUserData;
      const hasValidUser = user && user.id && user.name;
      const hasValidToken = token && token.length > 0 && token !== 'null' && token !== 'undefined';

      if (isLoggedIn && hasValidUser && hasValidToken) {
        // 認證用戶模式
        socketOptions.query = {
          token: token,
          // 額外加上用戶 ID 幫助後端識別
          userId: user.id.toString(),
          userName: user.name
        };

        finalUserData = {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          isAuthenticated: true
        };

      } else {
        // 訪客模式
        finalUserData = {
          userId: null,
          userName: '訪客',
          userEmail: null,
          isAuthenticated: false
        };

      }


      // 建立連接
      const newSocket = io('http://localhost:3005', socketOptions);

      // 連接成功事件
      newSocket.on('connect', () => {
        setIsConnected(true);

        // 重要：延遲一點再發送用戶資料，確保後端準備好
        setTimeout(() => {
          newSocket.emit('join_as_customer', finalUserData);
        }, 100);
      });

      // 連接錯誤
      newSocket.on('connect_error', (error) => {
        console.error('Socket 連接錯誤:', error);
        setIsConnected(false);
      });

      // 斷線
      newSocket.on('disconnect', (reason) => {
        console.log('Socket 斷線，原因:', reason);
        setIsConnected(false);
      });

      // 認證成功回應
      newSocket.on('auth_success', (data) => {
        console.log('後端認證成功:', data);
      });

      // 認證失敗回應  
      newSocket.on('auth_failed', (data) => {
        // 認證失敗時重新以訪客身份連接
        setTimeout(() => {
          const guestData = {
            userId: null,
            userName: '訪客',
            userEmail: null,
            isAuthenticated: false
          };
          newSocket.emit('join_as_customer', guestData);
        }, 1000);
      });

      // 成功加入房間
      newSocket.on('room_joined', (data) => {
        // console.log('成功加入聊天房間:', data);
        setRoomId(data.roomId);
        setChatStatus(data.status);
        setMessages(data.messages || []);
        setIsChatOpen(true);
        setAgentName(data.agentName || '客服專員');
      });

      // 房間建立
      newSocket.on('room_created', (data) => {
        // console.log('聊天房間已建立:', data);
        setRoomId(data.roomId);
        setChatStatus('waiting');
      });

      // 聊天被接受
      newSocket.on('chat_accepted', (data) => {
        // console.log('聊天被客服接受:', data);
        setChatStatus('active');
        setMessages(data.messages || []);
        setAgentName(data.agentName || '客服專員');
        setUnreadCount(0);
      });

      // 新訊息
      newSocket.on('new_message', (message) => {
        // console.log('收到新訊息:', message);
        setMessages(prev => [...prev, message]);
        if (!isChatOpen) {
          setUnreadCount(prev => prev + 1);
        }
        setTimeout(scrollToBottom, 100);
      });

      // 聊天結束
      newSocket.on('chat_ended', () => {
        // console.log('聊天已結束');
        setChatStatus('offline');
        setAgentName('');
        setMessages([]);
        setRoomId(null);
      });

      // 錯誤處理
      newSocket.on('error', (error) => {
        // console.error('聊天系統錯誤:', error);
        if (error && error.message) {
          alert(error.message);
        }
      });

      // 認證警告
      newSocket.on('auth_warning', (warning) => {
        console.warn('認證警告:', warning);
      });

      // 連接成功確認
      newSocket.on('connection_success', (data) => {
      });

      setSocket(newSocket);
    }, 3000); // 增加延遲到 3 秒，確保所有狀態完全穩定

    return () => {
      clearTimeout(timer);
      if (socket?.connected) {
        console.log('清理並關閉 Socket 連接');
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [isLoading, isLoggedIn, user?.id]);











  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startChat = () => {
    console.log(' Starting chat...');
    if (!socket || !isConnected) {
      console.error('Socket not ready:', { socket: !!socket, isConnected });
      alert('聊天系統未準備就緒，請稍後再試');
      return;
    }


    console.log('📤 Requesting customer service...');
    socket.emit('request_customer_service', {
      ...userData,
    });

    setIsChatOpen(true);
    setChatStatus('waiting');
    setMessages([]);

  };

  const sendMessage = () => {
    console.log('Attempting to send message:', {
      currentMessage,
      socket: !!socket,
      roomId,
      chatStatus
    });

    if (!currentMessage.trim()) {
      console.log('❌ Empty message');
      return;
    }

    if (!socket) {
      console.error('❌ No socket connection');
      alert('聊天連接已斷開');
      return;
    }

    if (!roomId) {
      console.error('❌ No room ID');
      alert('請先開始對話');
      return;
    }

    console.log('📤 Sending message...');
    socket.emit('send_message', {
      roomId,
      message: currentMessage,
      messageType: 'text'
    });

    setCurrentMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endChat = () => {
    if (!socket || !roomId) return;

    socket.emit('end_chat', { roomId });
    setIsChatOpen(false);
    setChatStatus('offline');
    setMessages([]);
    setRoomId(null);
    setAgentName('');
    setUnreadCount(0);
  };

  const toggleChat = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
    } else {
      setIsChatOpen(true);
      setUnreadCount(0);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = () => {
    switch (chatStatus) {
      case 'waiting':
        return '等待客服中...';
      case 'active':
        return `與 ${agentName} 對話中`;
      case 'offline':
      default:
        return isConnected ? '點擊開始對話' : '連接中...';
    }
  };
  // 如果正在載入認證狀態，顯示載入中
  if (loading) {
    return (
      <div className="oakly-chat-system">
        <div className="customer-chat-widget">
          <button className="chat-toggle-btn" disabled>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // 調試用：顯示當前狀態
  const debugInfo = process.env.NODE_ENV === 'development' ? {
    isConnected,
    chatStatus,
    roomId,
    hasSocket: !!socket,
    messagesCount: messages.length
  } : null;

  return (
    <div className="oakly-chat-system">

      <div className="customer-chat-widget">
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="header-left">
                <div className="company-logo">
                  <div className="logo-circle">O</div>
                  <span>Oakly 客服</span>
                </div>
                <div className="status-indicator">
                  <span className={`status-dot ${chatStatus}`}></span>
                  <span className="status-text">{getStatusText()}</span>
                </div>
              </div>
              <button className="close-chat" onClick={toggleChat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && chatStatus === 'offline' && (
                <div className="welcome-message">
                  <div className="welcome-icon">💬</div>
                  <h3>歡迎來到 Oakly 客服</h3>
                  <p>我們專業的客服團隊將協助您解答有關家具的任何問題</p>
                  {isLoggedIn && (
                    <p className="auth-status">已登入會員，享有完整服務記錄</p>
                  )}
                  <button
                    className="start-chat-btn"
                    onClick={startChat}
                    disabled={!isConnected}
                  >
                    {isConnected ? '開始對話' : '連接中...'}
                  </button>
                </div>
              )}

              {chatStatus === 'waiting' && messages.length > 0 && (
                <div className="waiting-message">
                  <div className="typing-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <p>客服專員將盡快為您服務，請稍候...</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`message ${message.sender_type === 'customer' ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <div className="message-bubble">
                      {message.message}
                    </div>
                    <div className="message-time">
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <div className="input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    !isConnected ? '連接中...' :
                      !roomId ? '請先開始對話' :
                        // chatStatus === 'waiting' ? '請等待客服回應...' : 
                        '輸入訊息...'
                  }
                  disabled={!isConnected || !roomId}
                  className="message-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || !isConnected || !roomId}
                  className="send-button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 11L11 13"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {chatStatus === 'active' && (
                <div className="chat-actions">
                  <button className="end-chat-btn" onClick={endChat}>
                    結束對話
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 聊天按鈕 */}
        <button
          className={`chat-toggle-btn ${isChatOpen ? 'open' : ''}`}
          onClick={toggleChat}
        >
          {isChatOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                  stroke="currentColor" strokeWidth="2" />
              </svg>
              {unreadCount > 0 && (
                <div className="unread-badge">{unreadCount}</div>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomerChat;