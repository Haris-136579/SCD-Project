import React, { useState, useEffect } from "react";
import { getUserTasks } from "../services/taskService";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [statusCount, setStatusCount] = useState({
    total: 0,
    pending: 0,
    "in-progress": 0,
    completed: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Update task counts
    setStatusCount({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      "in-progress": tasks.filter((task) => task.status === "in-progress")
        .length,
      completed: tasks.filter((task) => task.status === "completed").length,
    });
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const data = await getUserTasks();
      setTasks(data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];

    // Apply status filter
    if (filter !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.status === filter);
    }

    // Apply sorting
    return filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "dueDate":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-gray-400">Manage and track your tasks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Total Tasks</p>
              <span className="text-white text-xl font-semibold">
                {statusCount.total}
              </span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2 text-xl">⏳</span>
                <p className="text-gray-400">Pending</p>
              </div>
              <span className="text-yellow-500 text-xl font-semibold">
                {statusCount.pending}
              </span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2 text-xl">▶️</span>
                <p className="text-gray-400">In Progress</p>
              </div>
              <span className="text-blue-500 text-xl font-semibold">
                {statusCount["in-progress"]}
              </span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-green-500 mr-2 text-xl">✓</span>
                <p className="text-gray-400">Completed</p>
              </div>
              <span className="text-green-500 text-xl font-semibold">
                {statusCount.completed}
              </span>
            </div>
          </div>
        </div>

        <TaskForm onTaskCreated={handleTaskCreated} />

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <span className="text-purple-500 mr-2 text-xl">🔍</span>
            <h2 className="text-xl font-semibold text-white">My Tasks</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field">
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          {getFilteredTasks().length > 0 ? (
            getFilteredTasks().map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleTaskUpdated}
                onDelete={handleTaskDeleted}
              />
            ))
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-400">
                {filter === "all"
                  ? "You don't have any tasks yet. Create one to get started!"
                  : `You don't have any ${filter} tasks.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
