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
    article_category_id = ?
GROUP BY
    a.id,
    a.title,
    a.published_date,
    ac.name

SELECT * FROM `articles` WHERE `title` LIKE "餐桌"

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
    title LIKE ?
GROUP BY
    a.id,
    a.title,
    a.published_date,
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