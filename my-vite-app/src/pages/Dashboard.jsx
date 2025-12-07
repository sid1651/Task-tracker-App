import React, { useEffect, useState, Suspense } from "react"; // 🔥 added Suspense
import API from "../api";
import Navbar from "../components/Navbar";
const TaskForm = React.lazy(() => import("../components/TaskForm"));
const TaskList = React.lazy(() => import("../components/TaskList"));
import { toast } from "react-toastify";

export default function Dashboard({ logout }) {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // for debounce
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1); // current page
  const [pages, setPages] = useState(1); // total pages
  const limit = 10; // items per page

  // 🔥 Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // reset to first page on search
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  // 🔥 Fetch tasks with pagination
  async function fetchTasks() {
    try {
      const qParams = new URLSearchParams();
      if (debouncedQuery) qParams.append("q", debouncedQuery);
      if (statusFilter) qParams.append("status", statusFilter);
      qParams.append("page", page);
      qParams.append("limit", limit);

      const res = await API.get(`/tasks?${qParams.toString()}`);
      setTasks(res.data.tasks);
      setPages(res.data.pages);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  }

  // Fetch when search/filter/page changes
  useEffect(() => {
    fetchTasks();
  }, [debouncedQuery, statusFilter, page]);

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
                setDebouncedQuery("");
                setStatusFilter("");
                setPage(1);
              }}
            >
              Reset
            </button>
          </div>

          {/* Task List */}
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskList tasks={tasks} onChange={fetchTasks} />
          </Suspense>

          {/* Pagination Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Task Form */}
        <div className="right-section">
          <Suspense fallback={<div>Loading form...</div>}>
            <TaskForm onSaved={fetchTasks} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
