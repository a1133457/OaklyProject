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

export default function UserOrganizerPage() {
  const [currentTab, setCurrentTab] = useState(1);
  // 抓取使用者的預約列表
  const userOrganizersResult = useFetch(
    "http://localhost:3005/api/user/organizers/1"
  );
  const userOrganizers = userOrganizersResult.data
    ? userOrganizersResult.data.data
    : [];
  // console.log("使用者的預約列表", userOrganizers);
  // console.log(
  //   "狀態值們",
  //   userOrganizers.map((item) => item.status)
  // );
  console.log("當前選中的 tab:", currentTab);

  // tab切換資料
  const filteredOrganizers = userOrganizers.filter((organizer) => {
    return organizer.status === currentTab;
  });
  // console.log(filteredOrganizers);

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
          </div>
          {/* <h6 className="t-gray600 text-center">{}</h6> */}
        </div>
      </section>
    </>
  );
}
