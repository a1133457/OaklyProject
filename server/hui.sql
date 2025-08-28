use okaly;
SELECT DATABASE();

--關閉外建檢查
SET FOREIGN_KEY_CHECKS = 0;
--開啟外鍵檢查
SET FOREIGN_KEY_CHECKS = 1;

-- 1.coupons 主表
CREATE TABLE coupons (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(20),
  discount_type TINYINT(1) NOT NULL,
  discount DECIMAL(7,2) NOT NULL,
  min_discount INT DEFAULT 0,
  max_amount INT DEFAULT NULL,
  start_at DATE,
  end_at DATE,
  valid_days INT DEFAULT NULL,
  is_valid TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE coupon_categories;
-- 2.coupon_categories 商品優惠類別
CREATE TABLE coupon_categories (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  coupon_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  FOREIGN KEY (category_id) REFERENCES products_category(id)
);

DROP TABLE coupon_level;
-- 3.coupon_levels 會員優惠
CREATE TABLE coupon_level (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  coupon_id INT NOT NULL,
  member_levels_id INT NOT NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  FOREIGN KEY (member_levels_id) REFERENCES member_levels(id)
);

DROP TABLE user_coupons;
-- 4.user_coupons 使用者的優惠券
CREATE TABLE user_coupons (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  user_id INT NOT NULL,
  coupon_id INT NOT NULL,
  get_at DATETIME,
  used_at DATETIME,
  expire_at DATETIME,
  status TINYINT(1) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

DROP TABLE products_category;
--5. 產品類別
CREATE TABLE `products_category` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(30) DEFAULT NULL
);

DROP TABLE member_levels;
-- 6.會員等級資料
CREATE TABLE `member_levels` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(20) DEFAULT NULL
);


-----------------------------優惠券假資料---------------------------------

-- 1.coupons 主表 假資料
INSERT INTO `coupons` (`id`, `name`, `code`, `discount_type`, `discount`, `min_discount`, `max_amount`, `start_at`, `end_at`, `valid_days`, `is_valid`) VALUES
(1, '期間限定優惠券', 'GRAB001A', 2, 0.98, 0, NULL, NULL, NULL, 7, 1),
(2, '期間限定優惠券', 'GRAB002B', 1, 120.00, 1400, NULL, NULL, NULL, 7, 1),
(3, '期間限定優惠券', 'GRAB003C', 2, 0.85, 1600, NULL, NULL, NULL, 7, 1);



-- 2.coupon_categories 商品優惠類別 假資料
INSERT INTO `coupon_categories` (`id`, `coupon_id`, `category_id`) VALUES
-- 券1：所有產品適用
(1, 1, 1), (2, 1, 2), (3, 1, 3), (4, 1, 4), (5, 1, 5), (6, 1, 6),
-- 券2：收納用品
(7, 2, 6),
-- 券3：辦公空間
(8, 3, 5);

-- 3.coupon_levels 會員優惠 假資料
INSERT INTO `coupon_level` (`id`, `coupon_id`, `member_levels_id`) VALUES
-- 三張券都適用所有會員等級
(1, 1, 1), (2, 1, 2), (3, 1, 3),
(4, 2, 1), (5, 2, 2), (6, 2, 3),
(7, 3, 1), (8, 3, 2), (9, 3, 3);

--5. 產品類別 假資料
INSERT INTO `products_category` (`id`, `name`) VALUES
(1, '客廳'),
(2, '餐廳/廚房'),
(3, '臥室'),
(4, '兒童房'),
(5, '辦公空間'),
(6, '收納用品');


-- 6.會員等級資料 假資料
INSERT INTO `member_levels` (`id`, `name`) VALUES
(1, '木芽會員'),
(2, '原木會員'),
(3, '森林會員');



------------------------------------------------------------------------


-- 1.用戶預約記錄主表
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    city VARCHAR(20) NOT NULL,
    district VARCHAR(20) NOT NULL,
    address VARCHAR(100) NOT NULL,
    organizer_id INT NOT NULL,
    price INT DEFAULT NULL,
    service_datetime DATETIME NOT NULL,
    note VARCHAR(255),
    status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=諮詢中，2=預約成功，3=服務完成，4=已取消',
    is_valid TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=有效，0=刪除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
    FOREIGN KEY (organizer_id) REFERENCES organizers(id)
);

-- 2.用戶家裡環境圖片
CREATE TABLE booking_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 3.整理師表
CREATE TABLE organizers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    photo VARCHAR(500),
    introduction VARCHAR(100),
    region TINYINT(1) NOT NULL,
    is_valid TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);          

DESCRIBE organizers;

---------------------------整理師假資料------------------------------------

-- 1.用戶預約記錄主表 假資料



-- 2.用戶家裡環境圖片 假資料



-- 3.整理師表 假資料
INSERT INTO organizers (name, photo, introduction, region, is_valid) VALUES
-- 北部地區 (6位)
('Mia', '/img/organizers/005.jpg', '以系統化整理為核心，深度了解居住者需求，專精小坪數空間規劃與收納美學設計。', 1, 1),

('雅婷', '/img/organizers/006.jpg', '專注親子家庭空間規劃，擅長兒童物品分類收納，打造安全舒適的成長環境。', 1, 1),

('魷魚', '/img/organizers/007.jpg', '衣物整理專業顧問，致力於建構個人風格衣櫥，提升日常穿搭效率與生活品質。', 1, 1),

('蕭諟', '/img/organizers/008.jpg', '廚房空間整理達人，專精廚具收納與食材管理，創造高效率的烹飪環境。', 1, 1),

('Evan', '/img/organizers/001.jpg', '工作空間整理專家，提升居家辦公效率，打造專注力與創意並存的環境。', 1, 1),

('花花', '/img/organizers/009.jpg', '極簡生活實踐者，引導客戶重新審視物品價值，建立清爽有質感的生活空間。', 1, 1),
-- 中部地區 (4位)
('Jason', '/img/organizers/002.jpg', '商業空間整理顧問，專精辦公環境優化，提升團隊工作效率與空間使用價值。', 2, 1),

('小宜', '/img/organizers/010.jpg', '老屋空間改造專家，善於挖掘舊空間潛力，重新定義居住功能與動線規劃。', 2, 1),

('瑜恩', '/img/organizers/011.jpg', '兒童教育整理師，培養孩子自主收納能力，建立良好生活習慣與責任感。', 2, 1),

('Emma', '/img/organizers/012.jpg', '季節收納規劃師，建立完整換季整理系統，讓衣物管理變得輕鬆有條理。', 2, 1),
-- 南部地區 (3位)
('阿賢', '/img/organizers/003.jpg', '斷捨離生活導師，協助客戶釋放空間壓力，重新找回生活的輕盈與自在感。', 3, 1),

('Sophie', '/img/organizers/013.jpg', '收納工具專業顧問，精通各類收納產品應用，打造最適合的個人化收納方案。', 3, 1),

('柏丞', '/img/organizers/004.jpg', '數位生活整理師，整合實體與虛擬空間管理，創造現代人的高效生活模式。', 3, 1);
DROP TABLE `organizers`;

------------------------------------------------------------------------
