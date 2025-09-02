"use client";
import ListCard from "./_components/ListCard";
import Sidebar from "../_components/sidebar";
//CSS
import styles from "@/styles/userOrganizer/userOrganizer.module.css";
// 自訂組件(全域)
// 自訂組件 (專用)
import ItemTab from "./_components/ItemTab";
import { useFetch } from "@/hooks/use-fetch";

export default function UserOrganizerPage() {

    // 抓取使用者的預約列表
    const userOrganizersResult = useFetch(
      "http://localhost:3005/api/user/organizers/1"
    );
    const userOrganizers = userOrganizersResult.data ? userOrganizersResult.data.data : [];
    console.log("使用者的預約列表", userOrganizers);
  

  return (
    <>
      <section>
        <div className="container-xl">
          <div className="d-flex flex-column gap-lg section">
            <h2 className="t-primary01 text-center">預約紀錄</h2>
            <ItemTab />
            <ListCard
              status={1}
              organizerName="Mia"
              serviceDate="2025/09/15"
              serviceAddress="台北市中正區忠孝東路一段123號"
              bookingId="000001"
              createdDate="2025/09/01"
              price={2000}
            />
          </div>
        </div>
      </section>
    </>
  );
}
