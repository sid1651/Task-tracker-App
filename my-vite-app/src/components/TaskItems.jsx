import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function TaskItem({ task, onChange }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority || "low",
    status: task.status || "To Do",
  });

  async function save() {
    try {
      await API.put(`/tasks/${task._id}`, form);
      toast.success("Saved");
      setEditing(false);
      onChange();
    } catch (err) {
      toast.error("Save failed");
    }
  }

  async function del() {
    if (!confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${task._id}`);
      toast.success("Deleted");
      onChange();
    } catch (err) {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="task-item">
      <div>
        {editing ? (
          <>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <div>
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
              <span className={`status-badge status-${task.status}`}>
                {task.status}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="task-actions">
        {editing ? (
          <>
            <button
              onClick={save}
              style={{ background: "green", color: "white" }}
            >
              Save
            </button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={del} style={{ background: "red", color: "white" }}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
