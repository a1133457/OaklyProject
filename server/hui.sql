use okaly;
SELECT DATABASE();

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


-- 2.coupon_categories 商品優惠類別
CREATE TABLE coupon_categories (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  coupon_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  FOREIGN KEY (category_id) REFERENCES products_category(id)
);

-- 3.coupon_levels 會員優惠
CREATE TABLE coupon_level (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  coupon_id INT NOT NULL,
  member_levels_id INT NOT NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  FOREIGN KEY (member_levels_id) REFERENCES member_levels(id)
);

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

--5. 產品類別
CREATE TABLE `products_category` (
  `category_id` int NOT NULL,
  `category_name` varchar(30) DEFAULT NULL
);

-- 6.會員等級資料
CREATE TABLE `member_levels` (
  `id` int NOT NULL,
  `name` varchar(20) DEFAULT NULL
);


-----------------------------優惠券假資料---------------------------------

-- 1.coupons 主表 假資料
INSERT INTO `coupons` (`id`, `name`, `code`, `discount_type`, `discount`, `min_discount`, `max_amount`, `start_at`, `end_at`, `valid_days`, `is_valid`) VALUES
(1, '新年家居折扣券', 'KSHUHPW8', 1, 120.00, 600, NULL, '2025-07-01', '2025-07-31', NULL, 1),
(2, '期間限定優惠券', 'EPIXFGK7', 2, 0.80, 0, NULL, NULL, NULL, 20, 1),
(3, '全館家電折扣', '9ZGRQX69', 1, 180.00, 700, NULL, '2025-08-01', '2025-08-15', NULL, 1),
(4, '床墊新品促銷', 'SFRUX1UU', 2, 0.85, 300, 500, '2025-09-01', '2025-09-30', NULL, 1),
(5, '會員專屬折價券', '2O0K6F6Q', 1, 250.00, 800, NULL, NULL, NULL, 25, 1),
(6, '餐廳家電超值折扣', '6FU9TCQB', 1, 90.00, 400, NULL, '2025-07-15', '2025-08-15', NULL, 1),
(7, '親子空間促銷券', '5SOUQVV7', 2, 0.75, 0, NULL, NULL, NULL, 30, 1),
(8, '全館清倉折扣', 'A3NF5SXQ', 1, 400.00, 2000, NULL, '2025-08-10', '2025-09-10', NULL, 1),
(9, '期間限定優惠券', 'RLMEGULB', 2, 0.90, 0, NULL, '2025-09-15', '2025-10-15', NULL, 1),
(10, '家具滿額現折', 'P9GNXFPM', 1, 300.00, 1500, 400, '2025-07-20', '2025-08-20', NULL, 1),
(11, '期間限定優惠券', '36W7BM33', 1, 200.00, 500, 80, '2025-09-01', '2025-10-10', NULL, 1),
(12, '夏季家具8折券', '67S1N46E', 2, 0.80, 0, NULL, '2025-07-10', '2025-08-10', NULL, 1),
(13, '辦公空間專屬券', 'VCSSK4M7', 1, 150.00, 600, 300, '2025-08-15', '2025-09-15', NULL, 1),
(14, '家具新品體驗券', 'FA56SJSK', 1, 100.00, 300, NULL, NULL, NULL, 15, 1),
(15, '臥室床架折扣券', '3G4Q3G1W', 1, 250.00, 1000, 400, '2025-09-25', '2025-10-25', NULL, 1),
(16, '親子房限量優惠券', 'H31HS6MR', 2, 0.85, 200, 90, '2025-07-05', '2025-08-05', NULL, 1),
(17, '餐廳廚房現金券', '3KJ9C4UY', 1, 120.00, 400, NULL, '2025-08-25', '2025-09-25', NULL, 1),
(18, '原木家具會員專屬券', 'VAB79GO1', 2, 0.75, 500, 400, NULL, NULL, 20, 1),
(19, '客廳沙發超值券', 'WTOAHZBE', 1, 300.00, 1200, 1200, '2025-10-01', '2025-10-31', NULL, 1);


-- 2.coupon_categories 商品優惠類別 假資料
INSERT INTO `coupon_categories` (`id`, `coupon_id`, `category_id`) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 1, 5),
(4, 2, 4),
(5, 2, 6),
(6, 3, 1),
(7, 3, 2),
(8, 3, 5),
(9, 3, 6),
(10, 4, 3),
(11, 4, 4),
(12, 5, 1),
(13, 5, 2),
(14, 5, 3),
(15, 5, 4),
(16, 5, 5),
(17, 5, 6),
(18, 6, 2),
(19, 6, 6),
(20, 7, 2),
(21, 7, 3),
(22, 7, 4),
(23, 8, 1),
(24, 8, 2),
(25, 8, 3),
(26, 8, 4),
(27, 8, 5),
(28, 8, 6),
(29, 9, 1),
(30, 9, 2),
(31, 9, 3),
(32, 9, 4),
(33, 9, 5),
(34, 9, 6),
(35, 10, 2),
(36, 10, 3),
(37, 10, 4),
(38, 11, 1),
(39, 11, 2),
(40, 12, 3),
(41, 12, 6),
(42, 13, 5),
(43, 14, 1),
(44, 14, 2),
(45, 14, 3),
(46, 14, 4),
(47, 14, 5),
(48, 14, 6),
(49, 15, 3),
(50, 16, 4),
(51, 17, 2),
(52, 17, 6),
(53, 18, 1),
(54, 18, 5),
(55, 19, 1),

-- 3.coupon_levels 會員優惠 假資料
INSERT INTO `coupon_levels` (`id`, `coupon_id`, `level_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 2),
(5, 3, 1),
(6, 3, 2),
(7, 3, 3),
(8, 4, 2),
(9, 4, 3),
(10, 5, 2),
(11, 5, 3),
(12, 6, 3),
(13, 7, 1),
(14, 7, 2),
(15, 8, 1),
(16, 8, 2),
(17, 8, 3),
(18, 9, 1),
(19, 9, 2),
(20, 9, 3),
(21, 10, 1),
(22, 10, 2),
(23, 11, 1),
(24, 11, 2),
(25, 11, 3),
(26, 12, 2),
(27, 12, 3),
(28, 13, 3),
(29, 14, 1),
(30, 15, 2),
(31, 15, 3),
(32, 16, 2),
(33, 17, 3),
(34, 18, 2),
(35, 19, 1),
(36, 19, 2),
(37, 19, 3),


--5. 產品類別 假資料
INSERT INTO `products_category` (`category_id`, `category_name`) VALUES
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
('Mia', '/img/organizers/005.jpg', '專精居家空間規劃，10年整理經驗，擅長小坪數空間收納設計', 1, 1),

('雅婷', '/img/organizers/006.jpg', '溫馨家庭收納顧問，專門協助有小孩的家庭整理玩具與用品', 1, 1),

('魷魚', '/img/organizers/007.jpg', '衣櫥整理專家，協助客戶建立個人風格與高效收納系統', 1, 1),

('蕭諟', '/img/organizers/008.jpg', '廚房收納達人，擅長廚具與食材的分類整理與空間規劃', 1, 1),

('Evan', '/img/organizers/001.jpg', '書房與工作空間整理師，提升居家辦公效率與舒適度', 1, 1),

('花花', '/img/organizers/009.jpg', '極簡生活顧問，幫助客戶斷捨離，打造清爽舒適生活環境', 1, 1),
-- 中部地區 (4位)
('Jason', '/img/organizers/002.jpg', '辦公室與商業空間整理專家，協助企業提升工作效率', 2, 1),

('小宜', '/img/organizers/010.jpg', '老屋收納改造專家，善於活化老舊空間創造新價值', 2, 1),

('瑜恩', '/img/organizers/011.jpg', '玩具與兒童用品整理師，讓孩子學會自主收納整理', 2, 1),

('Emma', '/img/organizers/012.jpg', '季節性收納專家，協助客戶建立四季衣物換季整理系統', 2, 1),
-- 南部地區 (3位)
('阿賢', '/img/organizers/003.jpg', '極簡生活實踐者，幫助客戶斷捨離打造清爽生活空間', 3, 1),

('Sophie', '/img/organizers/013.jpg', '收納用品達人，精通各類收納工具的選擇與使用技巧', 3, 1),

('柏丞', '/img/organizers/004.jpg', '數位整理專家，協助整理電腦檔案與數位生活空間規劃', 3, 1);  


------------------------------------------------------------------------
