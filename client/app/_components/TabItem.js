import clsx from "clsx";

export default function TabItem({ children, onClick, className, ...props }) {
  console.log("TabItem className:", className);
  return (
    <>
      <button className={clsx("btn tab-items", className)}
      onClick={onClick}
      {...props}
      >{children}</button>
    </>
  )
}
