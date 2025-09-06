// 導入組裝的元件
// import Sidebar from './_components/layout/sidebar'
import Sidebar from './_components/sidebar'
import styles from './user.module.css'

export const metadata = {
  title: '會員中心',
  description: '這是會員中心的描述',
}

export default function AdminLayout({ children }) {
  return (
    <>
      <div className={`container-fluid ${styles.userContainer}`}>
        <div className={styles.layout}>
          <div className={styles.sidebarWrapper}>
            <Sidebar />
          </div>
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>


      {/* <div>{children}</div> */}
    </>
  )
}
