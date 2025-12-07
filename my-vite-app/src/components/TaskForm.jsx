import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function TaskForm({ onSaved }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");

  async function submit(e) {
    e.preventDefault();
    if (!title) return toast.error("Title required");
    try {
      await API.post("/tasks", { title, description: desc, dueDate: dueDate || null, priority });
      setTitle(""); setDesc(""); setDueDate(""); setPriority("low");
      toast.success("Task created");
      onSaved();
    } catch (err) {
      toast.error("Failed to create task");
    }
  }

  return (
    <form onSubmit={submit}>
      <h3>Create Task</h3>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
      </select>
      <button style={{ background: "#4f46e5", color: "white", marginTop: "10px", width: "100%" }}>Add Task</button>
    </form>
  );
}
