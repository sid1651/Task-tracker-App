import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { toast } from "react-toastify";

export default function Dashboard({ logout }) {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // 🔥 added for debounce
  const [statusFilter, setStatusFilter] = useState("");

  // 🔥 Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400); // delay 400ms

    return () => clearTimeout(handler);
  }, [query]);

  async function fetchTasks() {
    try {
      const q = debouncedQuery
        ? `?q=${encodeURIComponent(debouncedQuery)}${
            statusFilter ? `&status=${encodeURIComponent(statusFilter)}` : ""
          }`
        : statusFilter
        ? `?status=${encodeURIComponent(statusFilter)}`
        : "";

      const res = await API.get(`/tasks${q}`);
      setTasks(res.data);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  }

  // 🔥 fetch when debounced query OR filter changes
  useEffect(() => {
    fetchTasks();
  }, [debouncedQuery, statusFilter]);

  return (
    <div className="dashboard">
      <Navbar onLogout={logout} />

      <div className="dashboard-container">
        <div className="left-section">

          {/* Search */}
          <input
            className="search-input"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Filters */}
          <div className="filter-row">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <button
              className="reset-btn"
              onClick={() => {
                setQuery("");
                setStatusFilter("");
              }}
            >
              Reset
            </button>
          </div>

          {/* List */}
          <TaskList tasks={tasks} onChange={fetchTasks} />
        </div>

        {/* TaskForm */}
        <div className="right-section">
          <TaskForm onSaved={fetchTasks} />
        </div>
      </div>
    </div>
  );
}
