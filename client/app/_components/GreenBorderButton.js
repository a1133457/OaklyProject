export default function GreenBorderButton({ children, onClick, ...props }) {
  return (
    <>
      <button 
      className="btn btn-green"
      onClick={onClick}
      {...props}
      >{children}

      </button>
    </>
  )
}
