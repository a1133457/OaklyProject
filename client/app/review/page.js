"use client"

import React, { useState } from 'react';
import '@/styles/review/review.css';

const Review = () => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 處理表單提交
    console.log({ rating, name, email, comment });
  };

  return (
    <div className="review-page">
      {/* 評論總覽區塊 */}
      <section className="review-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <div className="rating-number">4.6</div>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < 4 ? 'filled' : ''}`}></i>
              ))}
            </div>
            <div className="review-count">125則評論</div>
          </div>
          <div className="rating-distribution">
            <div className="rating-bar">
              <span>5星</span>
              <div className="bar-container">
                <div className="bar" style={{width: '50%'}}></div>
              </div>
              <span>50%</span>
            </div>
            <div className="rating-bar">
              <span>4星</span>
              <div className="bar-container">
                <div className="bar" style={{width: '30%'}}></div>
              </div>
              <span>30%</span>
            </div>
            <div className="rating-bar">
              <span>3星</span>
              <div className="bar-container">
                <div className="bar" style={{width: '10%'}}></div>
              </div>
              <span>10%</span>
            </div>
            <div className="rating-bar">
              <span>2星</span>
              <div className="bar-container">
                <div className="bar" style={{width: '5%'}}></div>
              </div>
              <span>5%</span>
            </div>
            <div className="rating-bar">
              <span>1星</span>
              <div className="bar-container">
                <div className="bar" style={{width: '5%'}}></div>
              </div>
              <span>5%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 個別評論區塊 */}
      <section className="review-list">
        <div className="review-item">
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">安妮</div>
              <div className="review-time">一個月前</div>
            </div>
          </div>
          <div className="review-rating">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fas fa-star ${i < 4 ? 'filled' : ''}`}></i>
            ))}
          </div>
          <div className="review-text">
            這張桌子真的很棒！尺寸剛好，清潔起來也很方便。設計簡潔美觀，放在客廳很適合。組裝也很簡單，一個人就能完成。
            這張桌子真的很棒！尺寸剛好，清潔起來也很方便。設計簡潔美觀，放在客廳很適合。組裝也很簡單，一個人就能完成。
            這張桌子真的很棒！尺寸剛好，清潔起來也很方便。設計簡潔美觀，放在客廳很適合。組裝也很簡單，一個人就能完成。

          </div>
          <div className="review-engagement">
            <div className="thumbs-up">
              <i className="fas fa-thumbs-up"></i>
              <span>25</span>
            </div>
            <div className="thumbs-down">
              <i className="fas fa-thumbs-down"></i>
              <span>5</span>
            </div>
          </div>
        </div>

        <div className="review-item">
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">張大名</div>
              <div className="review-time">二個月前</div>
            </div>
          </div>
          <div className="review-rating">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fas fa-star ${i < 4 ? 'filled' : ''}`}></i>
            ))}
          </div>
          <div className="review-text">
            品質很好，穩定性佳。雖然組裝有點複雜，但說明書很清楚。顏色和質感都很棒，值得推薦！
          </div>
          <div className="review-engagement">
            <div className="thumbs-up">
              <i className="fas fa-thumbs-up"></i>
              <span>18</span>
            </div>
            <div className="thumbs-down">
              <i className="fas fa-thumbs-down"></i>
              <span>3</span>
            </div>
          </div>
        </div>

        <div className="review-item">
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">琪琪</div>
              <div className="review-time">三個月前</div>
            </div>
          </div>
          <div className="review-rating">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fas fa-star ${i < 4 ? 'filled' : ''}`}></i>
            ))}
          </div>
          <div className="review-text">
            很喜歡這個設計，簡約但不失質感。組裝過程順利，客服也很貼心。整體來說很滿意！
          </div>
          <div className="review-engagement">
            <div className="thumbs-up">
              <i className="fas fa-thumbs-up"></i>
              <span>30</span>
            </div>
            <div className="thumbs-down">
              <i className="fas fa-thumbs-down"></i>
              <span>2</span>
            </div>
          </div>
        </div>
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