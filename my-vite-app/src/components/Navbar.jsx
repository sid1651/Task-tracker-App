import React from "react";

export default function Navbar({ onLogout }) {
  return (
    <header>
      <h1>Task Tracker</h1>
      <button onClick={onLogout}>Logout</button>
    </header>
  );
}
