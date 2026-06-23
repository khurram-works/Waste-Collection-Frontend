import { useNavigate } from "react-router-dom"

export function useAuthNavigation() {

  const navigate = useNavigate()

  const citizen = () => {
    navigate("/citizen")
  }

  const login = () => {
    navigate("/login")
  }

  const signup = () => {
    navigate("/register")
  }

  const admin = () => {
    navigate("/admin")
  }

  const worker = () => {
    navigate("/worker")
  }

  const home = () =>{
    navigate("/")
  }

  const unauthorized = () =>{
    navigate("/unauthorized")
  }

  return { login, citizen, signup, admin, worker,home, unauthorized}
}