"use client"

import React, { useState, useEffect } from 'react';
import '@/styles/review/review.css';

const Review = ({ productId = 1 }) => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);


  // 獲取評論
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/products/${productId}/reviews`);
      if (!response.ok) throw new Error('網路錯誤');
      const result = await response.json();
      if (result.status === 'success') {
        setReviews(result.data);
      }
    } catch (error) {
      console.error('獲取評論失敗:', error);
    }
  };

  // 格式化時間
  const formatTime = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return '今天';
    if (days < 30) return `${days}天前`;
    return `${Math.floor(days / 30)}個月前`;
  };
   // 表單驗證
   const validateForm = () => {
    if (rating === 0) {
      alert('請選擇評分');
      return false;
    }
    if (!name.trim()) {
      alert('請輸入姓名');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('請輸入有效的Email');
      return false;
    }
    if (!comment.trim()) {
      alert('請輸入評論內容');
      return false;
    }
    return true;
  };
  // 提交評論
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('表單資料:', { rating, name, email, comment, productId });
    // 表單驗證
    if (!validateForm()) return;
    // ===== 真實環境需要的認證檢查 (目前註解掉) =====
    // const token = localStorage.getItem('authToken');
    // const userId = localStorage.getItem('userId');
    // if (!token || !userId) {
    //   alert('請先登入會員才能提交評論');
    //   return;
    // }
    // ===== 測試環境用的假資料 =====
    const userId = 'test-user-id'; // 測試用，真實環境會從 localStorage 或 context 取得


    try {
      const response = await fetch('http://localhost:3005/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ===== 真實環境需要的 Authorization header (目前註解掉) =====
          // 'Authorization': `Bearer ${token}`
        body: JSON.stringify({
          user_id: 1,
          product_id: productId,
          rating,
          email,
          comment,
          user_name: name,
          avatar: `https://i.pravatar.cc/150?u=${name}`
        })
      });
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const result = await response.json();
      if (result.status === 'success') {
        alert('評論提交成功！');
        setRating(0);
        setName('');
        setEmail('');
        setComment('');
        fetchReviews();
      }
    } catch (error) {
      alert('提交失敗');
      console.error('提交評論失敗:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const getRatingDistribution = () => {
    if (reviews.length === 0) return [0, 0, 0, 0, 0];
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(review => dist[review.rating - 1]++);
    return dist.map(count => Math.round((count / reviews.length) * 100));
  };

  const distribution = getRatingDistribution();


  return (
    <div className="review-page">
      {/* 評論總覽區塊 */}
      <section className="review-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <div className="rating-number">{averageRating}</div>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < Math.round(averageRating) ? 'filled' : ''}`}></i>
              ))}
            </div>
            <div className="review-count">{reviews.length}則評論</div>
          </div>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="rating-bar">
                <span>{star}星</span>
                <div className="bar-container">
                  <div className="bar" style={{ width: `${distribution[star - 1]}%` }}></div>
                </div>
                <span>{distribution[star - 1]}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 個別評論區塊 */}
      <section className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="user-info">
              <img
                src={review.avatar}
                alt={review.user_name}
                className="user-avatar"
              />
              <div className="user-details">
                <div className="user-name">{review.user_name}</div>
                <div className="review-time">{formatTime(review.created_at)}</div>
              </div>
            </div>
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}></i>
              ))}
            </div>
            <div className="review-text">
              {review.comment}
            </div>
            <div className="review-engagement">
              <div className="thumbs-up">
                <i className="fas fa-thumbs-up"></i>
                <span>0</span>
              </div>
              <div className="thumbs-down">
                <i className="fas fa-thumbs-down"></i>
                <span>0</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 撰寫評論區塊 */}
      <section className="write-review">
        <h2>寫下您的評論</h2>
        <form onSubmit={handleSubmit}>
          <div className="rating-input">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${i < rating ? 'filled' : ''}`}
                onClick={() => setRating(i + 1)}
              ></i>
            ))}
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <textarea
            placeholder="談談你對傢俱質感、配色、舒適度的看法"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">送出</button>
            <button type="button" className="return-btn">返回</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Review;