import React, { useState } from 'react';
import { createTask } from '../services/taskService';
import toast from 'react-hot-toast';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newTask = await createTask(formData);
      onTaskCreated(newTask);
      toast.success('Task created successfully');
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      setIsExpanded(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700 transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-white">
        {isExpanded ? 'Create a New Task' : 'What would you like to do today?'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onFocus={() => setIsExpanded(true)}
            placeholder="Enter task title..."
            className="input-field w-full"
            required
          />
        </div>
        
        {isExpanded && (
          <>
            <div className="mb-4">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description..."
                className="input-field w-full h-24"
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="priority" className="block mb-1 text-sm font-medium text-gray-300">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block mb-1 text-sm font-medium text-gray-300">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input-field w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : 'Create Task'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default TaskForm;