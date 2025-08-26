"use client";
import ListDetails from "./_components/ListDetails";
//CSS
import styles from "@/styles/userOrganizer/userOrganizer.module.css";
// 自訂組件(全域)
// 自訂組件 (專用)
import ItemTab from "../_components/ItemTab";

export default function UserOrganizerDetailPage() {
  return (
    <>
      <section>
        <div className="container-xl">
          <div className="d-flex flex-column gap-lg section">
            <h2 className="t-primary01 text-center">預約記錄</h2>
              <ItemTab />
            <ListDetails />
          </div>
        </div>
      </section>
    </>
  );
}
