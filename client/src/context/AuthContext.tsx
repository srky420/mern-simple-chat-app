import { useState } from "react"

const AuthContext = () => {
  const [accessToken, setAccesToken] = useState('');

  return (
    <div>AuthContext</div>
  )
}

export default AuthContext