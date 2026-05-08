import { createContext, useContext, useState } from "react"

const LoginContext = createContext()

export const useLogin = () => useContext(LoginContext)

export const LoginProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)

  const openLogin = () => setShowLogin(true)
  const closeLogin = () => setShowLogin(false)

  return (
    <LoginContext.Provider value={{ showLogin, openLogin, closeLogin }}>
      {children}
    </LoginContext.Provider>
  )
}
