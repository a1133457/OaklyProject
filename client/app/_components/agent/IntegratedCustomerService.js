"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

const ModernCustomerService = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [conversationStatus, setConversationStatus] = useState('auto_reply');
  const [lastMessageId, setLastMessageId] = useState(0);
  const [agentName, setAgentName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);
  

  // 改進的自動回覆系統
  const autoReplies = {
    '配送': '我們提供全台免費配送服務，一般3-5個工作日送達。如需特殊配送時間，請告知我們！',
    '退貨': '商品收到後7天內可申請退貨，傢俱類商品需保持原包裝完整。退貨流程簡單快速。',
    '保固': '所有商品提供1年保固服務，實木傢俱提供2年保固。保固期內免費維修或更換。',
    '材質': '我們的傢俱主要使用環保材質，包括實木、環保板材等，符合國際環保標準。',
    '安裝': '大型傢俱提供免費安裝服務，小型商品附有詳細安裝說明書和影片教學。',
    '付款': '支援信用卡、ATM轉帳、LINE Pay、街口支付等多種付款方式。',
    '營業': '營業時間：週一至週日 09:00-21:00，線上客服24小時為您服務。',
    '尺寸': '所有商品頁面都有詳細尺寸規格，如有疑問可提供客製化建議。',
    '顏色': '商品提供多種顏色選擇，實際顏色可能因螢幕顯示略有差異。',
    '庫存': '庫存狀況即時更新，熱門商品建議提早下單以免缺貨。'
  };

  const quickQuestions = [
    '配送需要多久？',
    '如何申請退貨？',
    '有什麼付款方式？',
    '提供安裝服務嗎？',
    '保固期多長？',
    '營業時間？'
  ];

  // 初始化聊天室
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 輪詢訊息
  useEffect(() => {
    if (conversationId && conversationStatus === 'active') {
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

  const initializeChat = async () => {
    setHasInitialized(true);
    
    // 顯示歡迎訊息
    const welcomeMessage = {
      id: Date.now(),
      text: '您好！歡迎來到 Oakly 傢俱客服，我是您的專屬客服助理。請問有什麼可以幫助您的嗎？',
      sender: 'agent',
      senderName: 'Oakly 客服',
      timestamp: new Date()
    };
    
  
    // 無論是否登入都嘗試連接真人客服
    try {
      const response = await fetch('http://localhost:3005/api/service/customer/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: user?.username || user?.name || '訪客',
          customerEmail: user?.email || '',
          userId: user?.id || null
        })
      });
  
      const data = await response.json();
      console.log('連接結果:', data); // 加這行來檢查
      if (data.success) {
        setConversationId(data.conversationId);
        setConversationStatus(data.status);
        
        // 載入歷史訊息
        await loadConversationMessages(data.conversationId);
        
        // 只在沒有歷史訊息時顯示歡迎訊息
        setTimeout(() => {
          setMessages(prev => {
            if (prev.length === 0) {
              return [welcomeMessage];
            }
            return prev;
          });
        }, 500);
      }
    } catch (error) {
      console.error('連接客服失敗:', error);
      // 保持自動回覆模式
      setMessages([welcomeMessage]); // 加這行

    }
  };

  const pollNewMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/service/conversation/${conversationId}/poll?lastMessageId=${lastMessageId}`);
      const data = await response.json();
  
      if (data.success && data.messages.length > 0) {
        const newMessages = data.messages
          .filter(msg => {
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
          setLastMessageId(data.messages[data.messages.length - 1].id);
          
          const agentMessage = newMessages.find(msg => msg.sender === 'agent');
          if (agentMessage) {
            setAgentName(agentMessage.senderName);
          }
        }
      }
    } catch (error) {
      console.error('輪詢訊息失敗:', error);
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
          sender: msg.sender_type === 'customer' && msg.sender_id === (user?.id || null) ? 'user' : msg.sender_type, // 修改這行
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

    // 添加用戶訊息
    const userMsg = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      senderName: user?.username || user?.name || '您',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // 如果有真人客服連線
    if (conversationStatus === 'active' && conversationId) {
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
            senderName: user?.username || user?.name || '訪客'
          })
        });
      } catch (error) {
        console.error('發送訊息失敗:', error);
      }
    } else {
      // 智能客服回覆
      setIsTyping(true);
      setTimeout(() => {
        const reply = getAutoReply(userMessage);
        const botMsg = {
          id: Date.now() + 1,
          text: reply,
          sender: 'agent',
          senderName: 'Oakly 智能客服',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000);
    }
  };

  const getAutoReply = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // 檢查關鍵字
    for (const [keyword, reply] of Object.entries(autoReplies)) {
      if (message.includes(keyword.toLowerCase())) {
        return reply;
      }
    }
    
    // 問候回覆
    if (message.includes('你好') || message.includes('哈囉') || message.includes('hi')) {
      return '您好！很高興為您服務，請問有什麼可以幫助您的嗎？您可以詢問商品資訊、配送、退貨等任何問題。';
    }
    
    // 感謝回覆
    if (message.includes('謝謝') || message.includes('感謝')) {
      return '不客氣！很高興能為您提供協助。如果還有其他問題，隨時都可以詢問我。';
    }
    
    // 預設回覆
    return '感謝您的詢問！我會盡力為您解答。如需更詳細的協助，建議您：\n\n• 致電客服專線：0800-123-456\n• 或在營業時間內使用線上真人客服\n• 營業時間：週一至週日 09:00-21:00';
  };

  const handleQuickQuestion = (question) => {
    setNewMessage(question);
    setTimeout(() => sendMessage(), 100);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
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
          width: '360px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          border: '1px solid #e5e5e5',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* 標題欄 */}
          <div style={{
            background: 'linear-gradient(135deg, #DBA783, #C89665)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🏠
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Oakly 客服</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  {conversationStatus === 'active' ? `${agentName || '真人客服'} 在線` : '智能客服 • 即時回覆'}
                </div>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ✕
            </button>
          </div>

          {/* 訊息區域 */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((message) => (
              <div key={message.id} style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  backgroundColor: message.sender === 'user' ? '#DBA783' : 
                                   message.sender === 'system' ? '#e3f2fd' : 'white',
                  color: message.sender === 'user' ? 'white' : '#333',
                  boxShadow: message.sender !== 'user' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }}>
                  <div style={{ whiteSpace: 'pre-line' }}>{message.text}</div>
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    marginTop: '6px'
                  }}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* 正在輸入指示器 */}
            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '20px 20px 20px 4px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '4px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#DBA783',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#DBA783',
                      animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#DBA783',
                      animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#666' }}>正在輸入...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 快速問題 */}
          {messages.length <= 2 && (
            <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', backgroundColor: 'white' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px', fontWeight: '500' }}>常見問題：</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #ddd',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#DBA783';
                      e.target.style.color = 'white';
                      e.target.style.borderColor = '#DBA783';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f5f5f5';
                      e.target.style.color = 'inherit';
                      e.target.style.borderColor = '#ddd';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 輸入區域 */}
          <div style={{ 
            padding: '20px', 
            borderTop: '1px solid #eee', 
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
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
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '24px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#DBA783'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  padding: '12px',
                  backgroundColor: newMessage.trim() ? '#DBA783' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (newMessage.trim()) {
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 聊天按鈕 */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '64px',
          height: '64px',
          backgroundColor: '#DBA783',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(219, 167, 131, 0.4)',
          zIndex: 999,
          transition: 'all 0.3s ease',
          fontSize: '24px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 32px rgba(219, 167, 131, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 24px rgba(219, 167, 131, 0.4)';
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default ModernCustomerService;