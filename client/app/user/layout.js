// 導入組裝的元件
// import Sidebar from './_components/layout/sidebar'

export const metadata = {
  title: '會員中心',
  description: '這是會員中心的描述',
}

export default function AdminLayout({ children }) {
  return (
    <>
      {/* <Sidebar /> */}
      {children}
    </>
  )
}
