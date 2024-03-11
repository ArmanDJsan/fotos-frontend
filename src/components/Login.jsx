import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import useAuth from "../hooks/auth";
function Login() {
  const [email, setEmail] = useState("amd@gmail.com");
  const [password, setPassword] = useState("password");
  const [errros, setErrors] = useState([]);

  const { login, logout, token } = useAuth();
  const handleLogin = async () => {
    login({ setErrors, email, password })
       if(token) {
            setEmail('');
            setPassword('');
        }
  };

  const handleLogout = () => {
    console.log("handingLogout");
    logout();
  }
  return (
    <>
      {token ? (
        <>
               <Navigate to="/usuarios" />
        </>
      ) : (
        <>
            <div className="card flex justify-content-center">
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="card flex justify-content-center">
            <InputText
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className=" flex justify-content-between">
            <Button onClick={handleLogin} label="login" icon="pi pi-check" />
          </div>
        </>
      )}
    </>
  );
}

export default Login;
