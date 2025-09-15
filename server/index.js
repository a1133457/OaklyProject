import express from "express";
import multer from "multer";
import cors from "cors";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import usersRouter from "./routes/users2.js";
import productsRouter from "./routes/productss.js";
import organizersRouter from "./routes/organizers.js";
import userOrganizersRouter from "./routes/userOrganizers.js";
import couponRouter from "./routes/coupons.js";
import userCouponRouter from "./routes/userCoupons.js";
import articleRouter from "./routes/article.js";
import orderRouter from "./routes/order.js";
import reviewsRouter from './routes/review.js';
import cartRouter from './routes/cart/ecpay3.js';
import shipRouter from './routes/seCallback.js';

import notifyRoutes from './routes/notify.js';




// 設定區
const upload = multer();
let whitelist = ["http://localhost:5500", "http://localhost:3000"];
let corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}



// 路由區
const app = express();
app.use(cors(corsOptions));
// 然後設置 JSON 解析
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public')) //後端提供public的靜態檔案
app.use('/uploads', express.static('uploads'));

// 添加調試中間件來檢查所有請求
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  next();
});


app.get("/", (req, res) => {
  res.send("首頁");
});


app.use("/api/users", usersRouter);
app.use('/api', reviewsRouter);
app.use("/api/organizers", organizersRouter);
app.use("/api/user/organizers", userOrganizersRouter);
app.use("/api/products", productsRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/user/coupons", userCouponRouter);
app.use("/api/article", articleRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("api/ship/711", shipRouter);
app.use('/uploads', express.static('public/uploads'));    // 評論圖片
app.use('/api/notify', notifyRoutes);





app.listen(3005, () => {
  console.log("主機啟動 http://localhost:3005");
});

