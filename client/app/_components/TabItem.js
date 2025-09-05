export default function TabItem({ children, onClick, ...props }) {
  return (
    <>
      <button className="btn tab-items"
      onClick={onClick}
      {...props}
      >{children}</button>
    </>
  )
}
