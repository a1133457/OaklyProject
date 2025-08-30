import pool from "../../connect.js"; // 這裡匯入你剛剛 export default 的 pool

export async function getProductsFromDB() {
  const [rows] = await pool.query(`
    SELECT p.*, pi.img
    FROM products p
    LEFT JOIN product_img pi ON p.id = pi.product_id
  `);
  return rows;}