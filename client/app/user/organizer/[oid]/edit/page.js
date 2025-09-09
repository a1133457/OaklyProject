"use client";
import styles from "@/styles/organizer/organizer.module.css";
import styles2 from "@/styles/userOrganizerDetails/userOrganizerDetails.module.css";
import { useFetch } from "@/hooks/use-fetch";
import { useParams } from "next/navigation";
import { useTab } from "@/contexts/TabContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
//CSS
// import styles from "@/styles/userOrganizer/userOrganizer.module.css";
// 自訂組件(全域)
import GreenBorderButton from "@/app/_components/GreenBorderButton";
// 自訂組件 (專用)

export default function UserOrganizerEditPage() {
  const router = useRouter();
  const params = useParams();
  const [token, setToken] = useState(null);
  const [userStr, setUserStr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const bookingId = params.oid;
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  // 修改狀態
  const [editData, setEditData] = useState({
    selectedCity: "",
    selectedDistrict: "",
    address: "",
    serviceDate: "",
    selectedOrganizers: "",
    note: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]); // 檔案上傳另外管理
  const [isConfirmed, setIsConfirmed] = useState(false); // checkbox 另外管理

  const result = useFetch(
    `http://localhost:3005/api/user/organizers/${userId}/${bookingId}`
  );
  //   const result = useFetch(
  //   `http://localhost:3005/api/user/organizers/TEST/${userId}/${bookingId}`
  // );

  const booking = result.data?.data; // 修正：確保有資料才渲染




  // 初始化editData
  useEffect(() => {
    if (booking) {
      console.log("=== BOOKING 資料 ===");
      console.log(JSON.stringify(booking, null, 2)); // 用 JSON.stringify 顯示完整結構
      setEditData({
        selectedCity: booking.city || "",
        selectedDistrict: booking.district || "",
        address: booking.address || "",
        serviceDate: booking.service_datetime
          ? booking.service_datetime.split(' ')[0].replace(/\//g, '-')
          : "",
        selectedOrganizers: booking.organizer_id || "",
        note: booking.note || "",
      });
    }
  }, [booking]);

  // 整理師fetch
  const organizerResult = useFetch("http://localhost:3005/api/organizers");
  const organizers = organizerResult.data ? organizerResult.data.data : [];
  if (organizerResult.error) {
    console.error("載入整理師資料失敗:", organizerResult.error);
  }

  // 圖片上傳
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    //限制4張
    if (files.length > 4) {
      alert("最多只能上傳4張圖片!");
      e.target.value = "";
      return;
    }
    setSelectedFiles(files);
  };

  // 圖片的input 創建 ref 來控制 input
  const fileInputRef = useRef(null);
  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  //日期選擇
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 14);
    return minDate.toISOString().split("T")[0];
  };

  // 地區JSON fetch
  const taiwanResult = useFetch("/TwCities.json");
  const taiwanData = taiwanResult.data || [];
  if (taiwanResult.error) {
    console.error("載入地區失敗:", taiwanResult.error);
  }

  // 地區北中南的地區分類
  const cityRegionMap = {
    // 北部 - 1
    臺北市: 1,
    新北市: 1,
    桃園市: 1,
    基隆市: 1,
    新竹市: 1,
    新竹縣: 1,
    // 中部 - 2
    臺中市: 2,
    苗栗縣: 2,
    彰化縣: 2,
    南投縣: 2,
    雲林縣: 2,
    // 南部 - 3
    嘉義市: 3,
    嘉義縣: 3,
    臺南市: 3,
    高雄市: 3,
    屏東縣: 3,
  };

  //提交按鈕
  const handleSubmit = async () => {
    // 檢查必填欄位
    if (!editData.selectedCity || !editData.selectedDistrict ||
      !editData.address || !editData.selectedOrganizers ||
      !editData.serviceDate || !isConfirmed) {
      alert("請填寫所有必填欄位並確認資訊無誤");
      return;
    }

    // 檢查圖片必填
    if (!booking.images?.length && selectedFiles.length === 0) {
      alert("請上傳環境照片");
      return;
    }

    try {
      // 準備要提交的資料
      const submitData = {
        city: editData.selectedCity,
        district: editData.selectedDistrict,
        address: editData.address,
        organizer_id: editData.selectedOrganizers,
        service_datetime: editData.serviceDate, // 轉換格式
        note: editData.note,
        hasNewImages: selectedFiles.length > 0,
      };

      console.log("準備提交的資料:", submitData);

      // 發送 PUT 請求到後端
      let response;

      if (selectedFiles.length > 0) {
        // 有新圖片時用 FormData
        const formData = new FormData();

        // 加入基本資料
        Object.keys(submitData).forEach(key => {
          formData.append(key, submitData[key]);
        });

        // 加入圖片檔案
        selectedFiles.forEach((file, index) => {
          formData.append('photos', file);
        });


        // 加入這個來檢查 FormData 內容
        console.log('FormData 內容:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        response = await fetch(
          `http://localhost:3005/api/user/organizers/${userId}/${bookingId}`,
          {
            method: "PUT",
            body: formData, // 不要設 Content-Type，讓瀏覽器自動設定
          }
        );
      } else {
        // 沒有新圖片時用 JSON
        response = await fetch(
          `http://localhost:3005/api/user/organizers/${userId}/${bookingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
          }
        );
      }
      // 先檢查回應內容
      const responseText = await response.text();
      console.log('後端回應狀態:', response.status);
      console.log('後端回應內容:', responseText);

      // 嘗試解析 JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error('JSON 解析錯誤:', error);
        alert('伺服器回應格式錯誤，請檢查後端API');
        return;
      }

      if (response.ok) {
        alert("預約資訊更新成功！");
        router.push("/user/organizer")
      } else {
        alert(`更新失敗：${result.message || '未知錯誤'}`);
      }
    } catch (error) {
      console.error("提交錯誤:", error);
      alert("網路錯誤，請稍後再試");
    }
  };

  //刪除按鈕
  const handleDelete = async () => {
    console.log("開始刪除流程");

    if (!window.confirm("確定要取消此預約嗎？")) {
      console.log("使用者取消刪除");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/user/organizers/${userId}/${bookingId}`,
        {
          method: "DELETE",
        }
      );

      const responseText = await response.text();
      console.log("後端回應:", responseText);

      if (response.ok) {
        alert("預約取消成功！");
        router.push("/user/organizer")
      } else {
        alert("取消失敗，請稍後再試");
      }

    } catch (error) {
      console.error("請求錯誤:", error);
      alert("網路錯誤，請稍後再試");
    }
  };

    // 處理登入
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("reactLoginToken");
    const userFromStorage = localStorage.getItem("user");

    setToken(tokenFromStorage);
    setUserStr(userFromStorage);

    //沒登入的跳轉
    if (!tokenFromStorage || !userFromStorage) {
      router.push("/auth/login");
      return;
    }

    setIsLoading(false);
  }, [router]);

  //解析token
  if (isLoading || !token || !userStr) {
    return <div>載入中...</div>;
  }


  // 修正：加上載入狀態和錯誤處理

  if (result.error) {
    return <div>載入失敗：{result.error.message}</div>;
  }

  if (!booking) {
    return <div>找不到預約資料</div>;
  }

  return (
    <>
      <section>
        <div className="container-xl">
          <div className="d-flex flex-column gap-lg section">
            <h2 className="t-primary01 text-center">編輯預約</h2>
            <form action="" method="POST" className="d-flex flex-column">
              {/* 第一個 row - 姓名 + 手機 */}
              <div className="row">
                <div className="col-12 col-md-6 mb-xl">
                  <label htmlFor="name" className="form-label t-primary03 label700">
                    姓名*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={booking.user_name}
                    readOnly
                    disabled
                    tabIndex="-1"
                  />
                </div>
                <div className="col-12 col-md-6 mb-xl">
                  <label htmlFor="phone" className="form-label t-primary03 label700">
                    手機號碼*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={booking.user_phone}
                    readOnly
                    disabled
                    tabIndex="-1"
                  />
                </div>
              </div>
              {/* 第二個 row - 信箱獨立一行 */}
              <div className="row">
                <div className="col-12 mb-xl">
                  <label htmlFor="email" className="form-label t-primary03 label700">
                    信箱*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={booking.user_email}
                    readOnly
                    disabled
                    tabIndex="-1"
                  />
                </div>
              </div>
              {/* 服務地址區塊 */}
              <div className="row">
                <div className="col-12">
                  <label className="form-label t-primary03 label700">服務地址*</label>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <select
                    value={editData.selectedCity}
                    onChange={(e) => {
                      setEditData({
                        ...editData,
                        selectedCity: e.target.value,
                        selectedDistrict: "",
                      });
                    }}
                    className="form-select mb-sm"
                    name="city"
                    required
                  >
                    <option value="" disabled>
                      請選擇縣市
                    </option>
                    {taiwanData.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <select
                    value={editData.selectedDistrict}
                    onChange={(e) => {
                      setEditData({
                        ...editData,
                        selectedDistrict: e.target.value,
                      });
                    }}
                    className="form-select mb-sm"
                    name="district"
                    required
                  >
                    <option value="" disabled>
                      請選擇區域
                    </option>
                    {taiwanData
                      .find((city) => city.name === editData.selectedCity)
                      ?.districts.map((district) => (
                        <option key={district.name} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-12 col-lg-6 mb-xl">
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="請輸入詳細地址"
                    value={editData.address}
                    onChange={(e) => {
                      setEditData({ ...editData, address: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
              {/* 選整理師+日期 */}
              <div className="row">
                <div className="col-12 col-md-6 mb-xl">
                  <label className="form-label t-primary03 label700">選擇整理師*</label>
                  <select
                    value={editData.selectedOrganizers}
                    onChange={(e) => {
                      setEditData({
                        ...editData,
                        selectedOrganizers: e.target.value,
                      });
                    }}
                    className="form-select"
                    name="city"
                    required
                  >
                    <option value="">請先選擇服務地址</option>
                    {editData.selectedCity &&
                      organizers
                        .filter(
                          (organizer) =>
                            organizer.region ===
                            cityRegionMap[editData.selectedCity]
                        )
                        .map((organizer) => (
                          <option key={organizer.id} value={organizer.id}>
                            {organizer.name}
                          </option>
                        ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 mb-xl">
                  <label className="form-label t-primary03 ">
                    <span className="label700">希望服務日期*</span>
                    （為確保最佳服務品質，請選擇2週後的日期）
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control"
                    min={getMinDate()}
                    value={editData.serviceDate}
                    onChange={(e) => {
                      setEditData({
                        ...editData,
                        serviceDate: e.target.value,
                      });
                    }}
                    required
                  />
                </div>
              </div>
              {/* 上傳照片 - 整合版 */}
              <div className="row">
                <div className="col-12">
                  <label className="form-label t-primary03 label700">
                    上傳整理環境照片*
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg"
                    multiple
                    className="d-none"
                  />
                  <div className="d-flex gap-3 flex-wrap">
                    {/* 上傳按鈕 */}
                    <div
                      className={`d-flex justify-content-center align-items-center ${styles.imgAdd}`}
                      onClick={handleDivClick}
                    >
                      <div className={styles.imgAddImg}></div>
                    </div>

                    {/* 顯示圖片：現有圖片或新選擇的圖片 */}
                    {selectedFiles.length > 0 ? (
                      // 顯示新選擇的圖片
                      selectedFiles.map((file, index) => (
                        <div key={index}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`新圖片 ${index + 1}`}
                            width={150}
                            height={150}
                            className={styles2.userHouseImage}
                          />
                        </div>
                      ))
                    ) : (
                      // 顯示現有圖片
                      booking.images && booking.images.map((imageUrl, index) => (
                        <div key={index}>
                          <img
                            src={`http://localhost:3005${imageUrl}`}
                            alt={`環境照片 ${index + 1}`}
                            width={150}
                            height={150}
                            className={styles2.userHouseImage}
                          />
                        </div>
                      ))
                    )}
                  </div>

                  {/* 提示訊息 */}
                  <p className="t-primary03 mb-xl mt-sm">
                    可上傳 1～4 張圖片，協助我們了解您的空間狀況
                    <br />
                    支援格式：.jpg、.jpeg、.png，建議每張 ≤ 5MB
                    {selectedFiles.length > 0 && (
                      <span className="text-success d-block mt-1">
                        已選擇 {selectedFiles.length} 張圖片，提交後將替換現有圖片
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {/* 備註 */}
              <div className="row">
                <div className="col-12">
                  <label className="form-label t-primary03 label700">備註</label>
                  <textarea
                    name="note"
                    id="note"
                    rows="4"
                    placeholder="請填寫特殊需求或想告訴整理師的事項（例如：寵物、家中空間限制…）"
                    className="form-control mb-xl"
                    value={editData.note}
                    onChange={(e) => {
                      setEditData({
                        ...editData,
                        note: e.target.value,
                      });
                    }}
                  ></textarea>
                </div>
              </div>
              <label className="t-primary03 mb-xl text-xl-center label700">
                <input
                  type="checkbox"
                  name="confirm"
                  id="confirm"
                  className="form-check-input me-2 "
                  checked={isConfirmed}
                  onChange={(e) => {
                    setIsConfirmed(e.target.checked);
                  }}
                />
                請確認以上資訊無誤，整理師將依據您提供的資料安排聯繫！
              </label>
              <div className="d-flex justify-content-center">
                <GreenBorderButton onClick={handleDelete}>取消預約</GreenBorderButton>
                <GreenBorderButton onClick={handleSubmit}>修改完成</GreenBorderButton>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
