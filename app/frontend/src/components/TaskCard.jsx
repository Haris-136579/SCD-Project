import React, { useState } from "react";
import { formatDate } from "../utils/formatDate";
import { updateTask, deleteTask } from "../services/taskService";
import toast from "react-hot-toast";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-900 text-green-300";
      case "in-progress":
        return "bg-blue-900 text-blue-300";
      case "pending":
        return "bg-yellow-900 text-yellow-300";
      default:
        return "bg-gray-800 text-gray-300";
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = await updateTask(task._id, { status: newStatus });
      onUpdate(updatedTask);
      toast.success("Task status updated successfully");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      onDelete(task._id);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 text-yellow-400">
            <span>⏳</span>
            <span>Pending</span>
          </span>
        );
      case "in-progress":
        return (
          <span className="flex items-center gap-1 text-blue-400">
            <span>▶️</span>
            <span>In Progress</span>
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1 text-green-400">
            <span>✓</span>
            <span>Completed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate") || null,
    };

    try {
      const updatedTask = await updateTask(task._id, updatedData);
      onUpdate(updatedTask);
      setIsEditing(false);
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  if (isEditing) {
    return (
      <div className="card mb-4">
        <form onSubmit={handleEdit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={task.title}
              className="input-field w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={task.description}
              className="input-field w-full h-24"
              required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-300 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={task.priority}
                className="input-field w-full">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-300 mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                defaultValue={task.dueDate ? task.dueDate.split("T")[0] : ""}
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2">
              <span>💾</span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card mb-4 transform transition-all duration-200 hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
            title="Edit task">
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete task">
            🗑️
          </button>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{task.description}</p>

      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              task.status
            )}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </div>

          <div className="flex items-center gap-1">
            <span className={getPriorityColor(task.priority)}>⚡</span>
            <span className="text-sm text-gray-300">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
              Priority
            </span>
          </div>
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-1 text-gray-400">
            <span>📅</span>
            <span className="text-sm">{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {task.status !== "completed" && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-end gap-2">
            {task.status === "pending" && (
              <button
                onClick={() => handleStatusChange("in-progress")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
                Start Working
              </button>
            )}
            <button
              onClick={() => handleStatusChange("completed")}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
              <span>✓</span>
              Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
