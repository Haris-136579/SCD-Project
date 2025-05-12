import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getAllTasks } from "../services/taskService";
import { getUsers, deleteUser } from "../services/userService";
import { deleteTask } from "../services/taskService";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCount, setStatusCount] = useState({
    total: 0,
    pending: 0,
    "in-progress": 0,
    completed: 0,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    // Update task counts
    if (tasks.length > 0) {
      setStatusCount({
        total: tasks.length,
        pending: tasks.filter((task) => task.status === "pending").length,
        "in-progress": tasks.filter((task) => task.status === "in-progress")
          .length,
        completed: tasks.filter((task) => task.status === "completed").length,
      });
    }
  }, [tasks]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "tasks") {
        const tasksData = await getAllTasks();
        setTasks(tasksData);
      } else if (activeTab === "users") {
        const usersData = await getUsers();
        setUsers(usersData);
      }
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task._id !== taskId));
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? All their tasks will be deleted as well."
      )
    ) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-1 bg-red-900 text-red-300 text-xs rounded-full">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 bg-yellow-900 text-yellow-300 text-xs rounded-full">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">
            Low
          </span>
        );
      default:
        return null;
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage all users and tasks</p>
        </div>

        {activeTab === "tasks" && (
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
                  <span className="text-yellow-500 mr-2">⏳</span>
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
                  <span className="text-blue-500 mr-2">▶️</span>
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
                  <span className="text-green-500 mr-2">✓</span>
                  <p className="text-gray-400">Completed</p>
                </div>
                <span className="text-green-500 text-xl font-semibold">
                  {statusCount.completed}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-4 px-6 flex justify-center items-center gap-2 transition-colors ${
                activeTab === "tasks"
                  ? "bg-purple-800 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("tasks")}>
              <span className="text-xl mr-2">📋</span>
              <span className="font-medium">All Tasks</span>
            </button>
            <button
              className={`flex-1 py-4 px-6 flex justify-center items-center gap-2 transition-colors ${
                activeTab === "users"
                  ? "bg-purple-800 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("users")}>
              <span className="text-xl mr-2">👥</span>
              <span className="font-medium">All Users</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "tasks" ? (
              <>
                {tasks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Task
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {tasks.map((task) => (
                          <tr
                            key={task._id}
                            className="hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-white font-medium">
                                  {task.title}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {task.description.substring(0, 50)}...
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-purple-700 rounded-full flex items-center justify-center mr-2">
                                  <span className="text-white font-medium text-sm">
                                    {task.user.name
                                      ? task.user.name.charAt(0).toUpperCase()
                                      : "U"}
                                  </span>
                                </div>
                                <span className="text-white">
                                  {task.user.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(task.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getPriorityBadge(task.priority)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {task.dueDate ? (
                                <div className="flex items-center gap-1 text-gray-300">
                                  <span>📅</span>
                                  <span>{formatDate(task.dueDate)}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500">
                                  No due date
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="text-red-400 hover:text-red-300 transition-colors text-xl"
                                title="Delete task">
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl text-gray-600 mb-4">📋</div>
                    <h3 className="text-xl font-medium text-gray-400 mb-2">
                      No tasks found
                    </h3>
                    <p className="text-gray-500">
                      There are no tasks in the system yet.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                          <tr
                            key={user._id}
                            className="hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-purple-700 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-medium">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-white font-medium">
                                  {user.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.isAdmin ? (
                                <span className="px-2 py-1 bg-purple-900 text-purple-300 text-xs rounded-full">
                                  Admin
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                                  User
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {user.createdAt
                                ? formatDate(user.createdAt)
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className={`text-red-400 hover:text-red-300 transition-colors text-xl ${
                                  user.isAdmin
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title="Delete user"
                                disabled={user.isAdmin}>
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl text-gray-600 mb-4">👥</div>
                    <h3 className="text-xl font-medium text-gray-400 mb-2">
                      No users found
                    </h3>
                    <p className="text-gray-500">
                      There are no users in the system yet.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
