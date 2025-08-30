-- SET FOREIGN_KEY_CHECKS = 0;

-- SET FOREIGN_KEY_CHECKS = 1;

-- 會員
CREATE TABLE IF NOT EXISTS users (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(50)  NOT NULL,
  birthday   DATE DEFAULT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,
  phone      VARCHAR(20)  DEFAULT NULL,
  postcode   VARCHAR(10)  DEFAULT NULL,
  city       VARCHAR(50)  DEFAULT NULL,
  area       VARCHAR(50)  DEFAULT NULL,
  address    VARCHAR(255) DEFAULT NULL,
  img        VARCHAR(255) DEFAULT NULL,
  level_id   INT UNSIGNED DEFAULT 1,   -- 可為 NULL；預設 1
  is_valid   TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_users_level
    FOREIGN KEY (level_id) REFERENCES user_levels(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CHECK (is_valid IN (0,1))
);

-- CREATE TABLE `member_levels` (
--     id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--     name VARCHAR(20)
-- );

-- 會員等級
CREATE TABLE IF NOT EXISTS user_levels (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) DEFAULT NULL,
  UNIQUE KEY uq_user_levels_name (name)
) ;

-- 我的最愛
CREATE TABLE IF NOT EXISTS favorites (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_fav_user_product (user_id, product_id),
  KEY idx_fav_user (user_id),
  KEY idx_fav_product (product_id),
  CONSTRAINT fk_fav_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_fav_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);
-- UNSIGNED 不一致
-- product_id → INT UNSIGNED
-- id → INT
-- 必須一致，否則會錯。 

-- 收藏文章
CREATE TABLE IF NOT EXISTS bookmarks (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  article_id INT UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_bookmark_user_article (user_id, article_id),
  KEY idx_bm_user (user_id),
  KEY idx_bm_article (article_id),
  CONSTRAINT fk_bm_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_bm_article
    FOREIGN KEY (article_id) REFERENCES articles(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);
 

-- 優惠券
CREATE TABLE coupons (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20),
    discount_type TINYINT(1) NOT NULL,
    discount DECIMAL(7, 2) NOT NULL,
    min_discount INT DEFAULT 0,
    max_amount INT DEFAULT NULL,
    start_at DATE,
    end_at DATE,
    valid_days INT DEFAULT NULL,
    is_valid TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coupon_categories (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    coupon_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupons (id),
    FOREIGN KEY (category_id) REFERENCES products_category (id)
);

CREATE TABLE coupon_level (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    coupon_id INT NOT NULL,
    level_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupons (id),
    FOREIGN KEY (level_id) REFERENCES user_levels (id)
);

CREATE TABLE user_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    coupon_id INT NOT NULL,
    get_at DATETIME,
    used_at DATETIME,
    expire_at DATETIME,
    status TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (coupon_id) REFERENCES coupons (id)
);

-- 文章
CREATE TABLE articles (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    content VARCHAR(500),
    article_category_id INT NOT NULL,
    published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`article_category_id`) REFERENCES article_category (`id`)
);

CREATE TABLE `article_category` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20)
);

CREATE TABLE `article_img` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNSIGNED NOT NULL,
    img VARCHAR(500),
    FOREIGN KEY (`article_id`) REFERENCES articles (`id`)
);

-- 文章追蹤
CREATE TABLE article_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NULL,
    event_type ENUM('view', 'like', 'share') NOT NULL,
    event_data JSON,
    ip_address VARCHAR(50),
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 商品
CREATE TABLE `products` (
    `id` INT UNSIGNED NOT NULL auto_increment PRIMARY KEY,
    `name` VARCHAR(100),
    `products_category_id` INT NOT NULL,
    `description` VARCHAR(500),
    `price` INT NOT NULL,
    `quantity` INT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `upload_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_valid` TINYINT NOT NULL DEFAULT 1,
    `product_img` VARCHAR(500),
    `style` VARCHAR(500),
    `shipping` VARCHAR(20),
    `colors_id` INT NOT NULL,
    `designers_id` INT NOT NULL,
    `materials_id` INT NOT NULL,
    `sizes_id` INT NOT NULL,
    `stocks_id` INT NOT NULL,
    FOREIGN KEY (`products_category_id`) REFERENCES products_category (`id`),
    FOREIGN KEY (`colors_id`) REFERENCES colors (`id`),
    FOREIGN KEY (`designers_id`) REFERENCES designers (`id`),
    FOREIGN KEY (`materials_id`) REFERENCES materials (`id`),
    FOREIGN KEY (`sizes_id`) REFERENCES sizes (`id`),
    FOREIGN KEY (`stocks_id`) REFERENCES stocks (`id`)
);

CREATE TABLE `products_category` (
    `id` INT NOT NULL auto_increment PRIMARY KEY,
    `name` VARCHAR(30)
);

-- 用戶預約記錄主表
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
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
    FOREIGN KEY (organizer_id) REFERENCES organizers (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 用戶家裡環境圖片
CREATE TABLE booking_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
);

-- 整理師表
CREATE TABLE organizers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    photo VARCHAR(500),
    introduction VARCHAR(100),
    region TINYINT(1) NOT NULL,
    is_valid TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品留言
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);
-- 顏色表
CREATE TABLE colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    color_name VARCHAR(50)
);

-- 商品與顏色關聯表（多對多）
CREATE TABLE product_colors (
    id INT,
    color_id INT,
    product_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (product_id, color_id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (color_id) REFERENCES colors (id)
);

-- 設計師
CREATE TABLE designers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

-- 材質
CREATE TABLE materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    material_name VARCHAR(100)
);

-- 尺寸
CREATE TABLE sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    size_label VARCHAR(50)
);

-- 商品-尺寸（多對多）
CREATE TABLE product_sizes (
    id INT,
    size_id INT,
    product_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (product_id, size_id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (size_id) REFERENCES sizes (id)
);

CREATE TABLE stock (
    id INT,
    color_id INT,
    size_id INT,
    amount INT DEFAULT 0,
    PRIMARY KEY (id, color_id, size_id),
    FOREIGN KEY (color_id) REFERENCES colors (id),
    FOREIGN KEY (size_id) REFERENCES sizes (id)
);

-- 訂單表
CREATE TABLE orders(
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    user_id INT UNSIGNED NOT NULL,
    total_amount INT NOT NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 訂單商品表
CREATE TABLE order_items(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    order_id INT NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    size VARCHAR(10),
    color VARCHAR(30),
    material VARCHAR(30),
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id)
)