import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { setAuthToken } from "./api";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔥 import loader registration function
// import { registerLoader } from "./loader";
import Loader from "./components/Loder";
import { registerLoader } from "./loderControl";

function App() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);  // 🔥 Set token before any API calls
    }
    setInitializing(false);
  }, []);

  useEffect(() => {
    registerLoader(setLoading);
  }, []);

  if (initializing) return null; // ⛔ Prevent Dashboard render before token is set

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
