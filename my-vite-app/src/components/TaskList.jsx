import React from "react";
import TaskItem from "./TaskItems";

export default function TaskList({ tasks, onChange }) {
  if (!tasks || tasks.length === 0)
    return <div className="task-list-empty">No tasks yet</div>;

  return (
    <div className="task-list">
      {tasks.map(t => (
        <TaskItem key={t._id} task={t} onChange={onChange} />
      ))}
    </div>
  );
}
