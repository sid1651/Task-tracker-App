import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { setAuthToken } from "./api";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "./components/Loder";
import { registerLoader } from "./loderControl";
    // import { registerLoader } from "./loaderControl";

function App() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token")); // ✅ get token synchronously
  const [initializing, setInitializing] = useState(true);

  // Set token in Axios immediately if exists
  useEffect(() => {
    if (token) {
      setAuthToken(token); // ✅ set header before API calls
    }
    setInitializing(false);
  }, [token]);

  useEffect(() => {
    registerLoader(setLoading);
  }, []);

  // Update localStorage whenever token changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  if (initializing) return null;

  return (
    <BrowserRouter>
      {loading && <Loader />}
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route
          path="/"
          element={
            token ? (
              <Dashboard logout={() => setToken(null)} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
