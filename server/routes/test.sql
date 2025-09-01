SELECT
    a.id,
    a.title,
    a.published_date,
    MIN(ai.img) AS first_img,
    ac.name AS category_name
FROM
    articles a
    LEFT JOIN article_img ai ON a.id = ai.article_id
    LEFT JOIN article_category ac ON a.article_category_id = ac.id
GROUP BY
    a.id,
    a.title,
    a.published_date,
    ac.name

SELECT
    a.id,
    a.title,
    a.published_date,
    MIN(ai.img) AS first_img,
    ac.name AS category_name
FROM
    articles a
    LEFT JOIN article_img ai ON a.id = ai.article_id
    LEFT JOIN article_category ac ON a.article_category_id = ac.id
WHERE
    article_category_id = 1
GROUP BY
    a.id,
    a.title,
    a.published_date,
    ac.name

SELECT * FROM `articles` WHERE `title` LIKE "餐桌"

SELECT
    a.id,
    a.title,
    DATE(a.published_date),
    MIN(ai.img) AS first_img,
    ac.name AS category_name
FROM
    articles a
    LEFT JOIN article_img ai ON a.id = ai.article_id
    LEFT JOIN article_category ac ON a.article_category_id = ac.id
WHERE
    a.title LIKE '%椅子%'
GROUP BY
    a.id,
    a.title,
    DATE(a.published_date),
    ac.name

SELECT * FROM articles WHERE published_date BETWEEN ? AND ?

SELECT
    a.id,
    a.title,
    a.published_date,
    MIN(ai.img) AS first_img,
    ac.name AS category_name
FROM
    articles a
    LEFT JOIN article_img ai ON a.id = ai.article_id
    LEFT JOIN article_category ac ON a.article_category_id = ac.id
WHERE
    DATE(published_date) BETWEEN '2025-08-10' AND '2025-08-15'
GROUP BY
    a.id,
    a.title,
    a.published_date,
    ac.name
ORDER BY published_date DESC

SELECT
    a.id,
    a.title,
    a.content,
    a.author,
    DATE(a.published_date),
    MIN(ai.img) AS first_img,
    ac.name AS category_name
FROM
    articles a
    LEFT JOIN article_img ai ON a.id = ai.article_id
    LEFT JOIN article_category ac ON a.article_category_id = ac.id
WHERE
    a.id = 1
GROUP BY
    a.id,
    a.title,
    a.content,
    a.author,
    DATE(a.published_date),
    ac.name

SELECT
    a.id,
    a.title,
    DATE(a.published_date),
    MIN(ai.img) AS first_img,
    ac.name AS category_name,
    COUNT(at.id) AS bookmark_count
FROM
    articles a
    LEFT JOIN article_tracking at ON a.id = at.article_id
    AND at.event_type = 'like'
    LEFT JOIN article_img ai ON a.id = ai.article_id
    LEFT JOIN article_category ac ON a.article_category_id = ac.id
GROUP BY
    a.id,
    a.title,
    DATE(a.published_date),
    ac.name
GROUP BY
    bookmark_count DESC

-- order
SELECT o.id AS order_id, o.order_number, o.total_amount, o.create_at, oi.product_id, oi.quantity, oi.price, oi.size, oi.color, oi.material
FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE
    o.user_id = 1
ORDER BY o.create_at DESC, oi.id ASC;

SELECT o.id AS order_id, o.order_number, o.total_amount, o.create_at, oi.product_id, oi.quantity, oi.price, oi.size, oi.color, oi.material
FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE
    o.user_id = 1
    AND o.id = 2
ORDER BY o.create_at DESC, oi.id ASC;

 SELECT 
            o.id AS order_id,
            o.user_id,
            o.order_number,
            o.total_amount,
            o.create_at,
            oi.product_id,
            oi.quantity,
            oi.price,
            oi.size,
            oi.color,
            oi.material
        FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = 1 AND o.id = 1
        ORDER BY o.create_at DESC, oi.id ASC;