import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const useAuth = ({ middleware = "auth", redirectIfAuthenticated } = {}) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // const userDataRef = useRef({ user: null, timestamp: null }); // Cache user data and timestamp

  const login = async ({ setErrors, ...props }) => {
    setUser("");
    setErrors([]);
    setError(false);
    setLoading(true);
    try {
      console.log("fn login");
      const response = await axios.post("/api/login", props);
      if (response.status === 200) {
        setToken(response.data.access_token);
        setAccessToken(response.data.access_token);
        console.log(response.data.access_token);
        setLoading(false);
      }
    } catch (error) {
      /*    if (error.response.status ==401){
        setErrors(error.response.data.errors);
      } */
      setErrors(error.response.data.errors);
      setError(true);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      //const token = getAccessToken();
      console.log(token);
      axios.defaults.headers["Authorization"] = "Bearer " + token;
      const response = await axios.post("/api/logout");

      console.log(response.status);
      if (response.status === 200) {
        setLoading(false);
        removeAccessToken();
        setToken("");
        navigate('/login');
      }
    } catch (error) {
      if (error.response.status === 401) {
        removeAccessToken();
        setToken("");
      } else console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const localToken = getAccessToken();
    if (localToken && !token) setToken(localToken);
  }, [token]);

  const getAccessToken = () => {
    const localStorageToken = localStorage.getItem("access_token");
    const localToken =
      localStorageToken !== "" ? JSON.parse(localStorageToken) : null;
    return localToken;
  };

  const setAccessToken = (token) => {
    localStorage.setItem("access_token", JSON.stringify(token));
  };

  const removeAccessToken = () => {
    localStorage.removeItem("access_token");
  };

  return {
    token,
    user,
    loading,
    error,
    login,
    logout,
  };
};

export default useAuth;
