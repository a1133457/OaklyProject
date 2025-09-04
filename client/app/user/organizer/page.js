"use client";
import ListCard from "./_components/ListCard";
import Sidebar from "../_components/sidebar";
//CSS
import styles from "@/styles/userOrganizer/userOrganizer.module.css";
// 自訂組件(全域)
// 自訂組件 (專用)
import ItemTab from "./_components/ItemTab";
import { useFetch } from "@/hooks/use-fetch";
import { useState } from "react";
import { useTab } from "@/contexts/TabContext"; 

export default function UserOrganizerPage() {
  const { currentTab, setCurrentTab } = useTab();  // ← 使用 Context
  // const [currentTab, setCurrentTab] = useState(1);
  // 抓取使用者的預約列表
  const userOrganizersResult = useFetch(
    "http://localhost:3005/api/user/organizers/1"
  );
  const userOrganizers = userOrganizersResult.data
    ? userOrganizersResult.data.data
    : [];



  // tab切換資料
  const filteredOrganizers = userOrganizers.filter((organizer) => {
    return organizer.status === currentTab;
  });
  // console.log(filteredOrganizers);

  // 狀態文字對應表
  const statusTexts = {
    1: "我們已收到您的需求，整理師將儘快與您聯繫",
    2: "整理師正在準備報價中，請耐心等候", 
    3: "服務進行中，感謝您的耐心等待",
    4: "服務已完成，謝謝您的使用"
  };


  return (
    <>
      <section>
        <div className="container-xl">
          <div className="d-flex flex-column gap-lg section">
            <h2 className="t-primary01 text-center">預約紀錄</h2>
            <ItemTab currentTab={currentTab} onTabChange={setCurrentTab} />

            {filteredOrganizers.map((organizer) => (
              <ListCard
                key={organizer.booking_id}
                status={organizer.status}
                organizerName={organizer.organizer_name}
                serviceDate={organizer.service_datetime}
                serviceAddress={organizer.full_address}
                bookingId={organizer.booking_id}
                createdDate={organizer.created_at}
                price={organizer.price}
              />
            ))}
          <h6 className="t-gray600 text-center">{statusTexts[currentTab]}</h6>
          </div>
        </div>
      </section>
    </>
  );
}
