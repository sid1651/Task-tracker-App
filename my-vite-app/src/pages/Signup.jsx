import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";


export default function Signup({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const nav = useNavigate();

  async function handle(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { email, password, name });
      setToken(res.data.token);
      toast.success("Account created");
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="signup-container">
      <form onSubmit={handle} className="signup-form">
        <h2 className="signup-title">Sign Up</h2>

        <input
          className="signup-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <input
          className="signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="signup-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button className="signup-btn">Sign Up</button>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
