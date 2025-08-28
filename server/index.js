import express from "express";
import multer from "multer";
import cors from "cors";
import moment from "moment";
import {v4 as uuidv4} from "uuid";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import organizersRouter from "./routes/organizers.js";
import couponRouter from "./routes/coupons.js";

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
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public')) //後端提供public的靜態檔案

app.get("/", (req, res)=>{
  res.send("首頁");
});

app.use("/api/users", usersRouter);
app.use("/api/pts", productsRouter);
app.use("/api/organizers", organizersRouter);
app.use("/api/coupons", couponRouter);


app.listen(3005, ()=>{
  console.log("主機啟動 http://localhost:3005");
});
