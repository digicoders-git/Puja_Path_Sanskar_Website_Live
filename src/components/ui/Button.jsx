const Button = ({ children, onClick, variant = "primary" }) => {
  const base = "px-4 py-2 rounded font-medium transition"
  const styles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  }

  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
