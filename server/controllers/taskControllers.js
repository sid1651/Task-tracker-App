import Task from "../models/task.js";

export async function getTasks(req, res) {
  try {
    const userId = req.user.id;
    const { q, status, page = 1, limit = 10 } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;
    if (q)
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
      ];

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Fetch tasks with pagination
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Get total count for frontend pagination
    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


export async function createTask(req, res) {
  const userId = req.user.id;
  const { title, description, dueDate, priority, status } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  const task = await Task.create({
    user: userId,
    title,
    description,
    dueDate,
    priority: priority || "low",
    status: status || "To Do"
  });
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const task = await Task.findOne({ _id: id, user: userId });
  if (!task) return res.status(404).json({ message: "Task not found" });

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const task = await Task.findOneAndDelete({ _id: id, user: userId });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Deleted" });
}
