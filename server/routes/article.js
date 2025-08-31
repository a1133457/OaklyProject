import express from "express";
import multer from "multer";
import connection from "../connect.js";


const upload = multer();

const router = express.Router();

// 獲取所有文章
router.get("/", async (req, res) => {
    try {
        const sql = "SELECT * FROM `articles`;";
        let [articles] = await connection.execute(sql);
        res.status(200).json({
            status: "success",
            data: articles,
            message: "已獲取所有文章"
        });
    } catch (error) {
        console.log(error);
        const statusCode = error.code ?? 401;
        const statusText = error.status ?? "error";
        const message = error.message ?? "文章查詢錯誤，請洽管理人員";
        res.status(statusCode).json({
            status: statusText,
            message,
        });
    }
});

// 搜尋文章
router.get("/search", (req, res) => {
    const key = req.query.key;
    res.status(200).json({
        status: "success",
        data: { key },
        message: "搜尋文章 成功"
    });
});

// 獲取特定 keyword 的文章
router.get("/:keyword", async (req, res) => {
    try {
        const keyword = req.params.keyword;
        if (!keyword) {
            const err = new Error("請輸入要搜尋的內容");
            err.code = 400;
            err.status = "fail";
            throw err;
        }

        const sqlCheck = "SELECT * FROM `articles` WHERE `title` LIKE ?;";
        const searchTerm = `%${keyword}%`;
        let articles = await connection
            .execute(sqlCheck, [searchTerm])
            .then(([result]) => {
                return result;
            });
        if (!articles || articles.length === 0) {
            const err = new Error("找不到此文章");
            err.code = 404;
            err.status = "fail";
            throw err;
        }

        res.status(200).json({
            status: "success",
            data: articles,
            message: "搜尋成功",
        });
    } catch (error) {
        const statusCode = error.code ?? 500;
        const statusText = error.status ?? "error";
        const message = error.message ?? "文章查詢錯誤，請洽管理人員";
        res.status(statusCode).json({
            status: statusText,
            message,
        });
    }
})

export default router;