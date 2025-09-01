CREATE TABLE comments (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
product_id INT NOT NULL,
comment TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id)
FOREIGN KEY (product_id) REFERENCES products(id));

INSERT INTO comments (user_id, product_id, comment) VALUES
(1, 1, '這款 KALLAX 層架組的設計真的是既美觀又實用。組裝時說明書清楚，零件編號完整，即使我是第一次 DIY，也能順利完成。完成後整體非常穩固，放書、擺飾或收納籃都毫不費力，大大提升收納效率與視覺整潔感。'),
(2, 1, '將 KALLAX 放進小型工作室後，空間瞬間放大不少。它的立體造型與流線線條自然融入整體風格，還能橫放變化用途。幾個方格當作展示與收納單元，讓整個房間看起來既有層次又更有秩序。'),
(3, 1, '我使用這款層架已有三年多了，歷經搬家仍然穩固耐用。質感雖不高檔，但實用性極強。朋友推薦它作為百搭收納單元，果然用久後也不掉價。:contentReference[oaicite:0]{index=0}'),
(4, 1, '收到後立刻開始組裝，螺絲孔精準、模組化程度高，組裝過程順暢又快速。完成後每個格子承重良好，甚至能放入布箱來隱藏雜物，整體美感與功能兼具。'),
(5, 1, '在網路社群看到有人用 KALLAX 改裝成床架，還能承受成年人重量，非常穩固！這讓我對它結構的強度另眼相看。:contentReference[oaicite:1]{index=1}'),
(6, 1, '我特別喜歡它每個格子的尺寸設計，無論是書籍、玩具還是雜物都剛好可以收納。搭配一些簡單配件就能創造獨特風格，收納空間與展示功能兼備。'),
(7, 1, '這款層架可垂直也可橫放，變化多、靈活度高。客廳、臥室、書房隨處都適合，對於小宅來說，收納功能尤其重要，KALLAX 完美滿足這需求。:contentReference[oaicite:2]{index=2}'),
(8, 1, '結構穩固，搬運重組都沒問題。材質稍輕但整體搭配妥善使用，其耐用性令人驚豔。長遠來看，搬家後依舊能維持良好狀態，相當值得。:contentReference[oaicite:3]{index=3}'),
(9, 1, '設計細節值得稱讚，邊緣光滑且層板對齊工整，整體質感扎實。每個小巧的細節都考量到使用者體驗，看得出設計師的用心。:contentReference[oaicite:4]{index=4}'),
(10, 1, '作為兒童房的收納單元，用 KALLAX 超級合適。方格尺寸適中，可以放玩具、書、籃子，小朋友自己也能輕鬆拿取。整潔又好用，空間瞬間變得有條理。:contentReference[oaicite:5]{index=5}'),
(11, 1, '我在客廳拿來當電視櫃，搭配插畫擺飾，整體畫面立刻變得很有個性。這款家具真的很百搭，不管甚麼場景，都能發揮作用。'),
(12, 1, '雖然材質屬於壓合板，但它的穩固度出乎意料。我用來放重書、音響設備都沒有晃動跡象，性價比極高，實用又不失美觀。'),
(13, 1, '幾年前買的 KALLAX，至今依舊使用中。搬到新家、當作展示架或收納櫃，各種用途都有用到。這種耐久性真的很不錯。:contentReference[oaicite:6]{index=6}'),
(14, 1, '看到許多 DIY 改造案例都會以 KALLAX 為基底，包括做成唱片櫃、工作台、隔斷牆，顯示它的改造潛力非常大。性價比高又靈活，是創意玩家的好選擇。:contentReference[oaicite:7]{index=7}'),
(15, 1, '總之，這款層架組能說是 IKEA 當家代表作，融合功能、靈活與美學於一體。不論是收納、展示、隔間或改造，全方位都能滿足，是平價家具中難得的持久經典。');
