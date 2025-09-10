"use client";
import ListDetails from "./_components/ListDetails";
//CSS
import styles from "@/styles/userOrganizer/userOrganizer.module.css";
// 自訂組件(全域)
// 自訂組件 (專用)
import ItemTab from "../_components/ItemTab";
import { useFetch } from "@/hooks/use-fetch";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTab } from "@/contexts/TabContext";
import { useRouter } from "next/navigation";

export default function UserOrganizerDetailPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userStr, setUserStr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const bookingId = params.oid;

  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;


  const { currentTab, setCurrentTab } = useTab(); // ← 使用 Context
  // 抓取使用者的預約列表
  const result = useFetch(
    `http://localhost:3005/api/user/organizers/${userId}/${bookingId}`
  );

  const booking = result.data?.data; // 修正：確保有資料才渲染

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
  if (result.loading) {
    return <div>載入中...</div>;
  }

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
            <h2 className="t-primary01 text-center">預約記錄</h2>
            <ItemTab
              currentTab={currentTab}
              onTabChange={(newTab) => {
                setCurrentTab(newTab);
                router.push("/user/organizer");
              }}
            />
            <ListDetails
              status={booking.status}
              organizerName={booking.organizer_name}
              serviceDate={booking.service_datetime}
              serviceAddress={booking.full_address}
              bookingId={booking.booking_id}
              createdAt={booking.created_at}
              userName={booking.user_name}
              userPhone={booking.user_phone}
              userEmail={booking.user_email}
              images={booking.images}
              note={booking.note}
              price={booking.price}
            />
          </div>
        </div>
      </section>
    </>
  );
}
