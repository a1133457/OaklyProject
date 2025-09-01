"use client";
import ListCard from "./_components/ListCard";
import Sidebar from '../_components/sidebar'
//CSS
import styles from "@/styles/userOrganizer/userOrganizer.module.css";
// 自訂組件(全域)
// 自訂組件 (專用)
import ItemTab from "./_components/ItemTab";

export default function UserOrganizerPage() {
  return (
    <>
      <section>
        <div className="container-xl">
          <div className="d-flex flex-column gap-lg section">
            <h2 className="t-primary01 text-center">預約紀錄</h2>
            <ItemTab/>
            <ListCard />
          </div>
        </div>
      </section>
    </>
  );
}
