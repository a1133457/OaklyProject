import express from "express";
import { sendResetEmail } from "../utils/mailer.js";

const router = express.Router();

router.get("/test-mail", async (req, res) => {
    try {
        const testEmail = "oakly0911@gmail.com";
        const link = `${process.env.APP_URL}/auth/reset?token=123456`;
        await sendResetEmail(testEmail, link, 15);
        res.json({ status: "ok", message: "測試信已寄出" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "寄信失敗" });
    }
});

export default router;
