import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, editingTask, clearEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTask]);

  const validate = () => {
    let formErrors = {};
    if (!title.trim()) {
      formErrors.title = 'Task title is mandatory.';
    } else if (title.trim().length < 3) {
      formErrors.title = 'Title must be at least 3 characters long.';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
    setErrors({});
  };

  return (
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">
        {editingTask ? '📝 Modify Selected Task' : '➕ Create New Task'}
      </h3>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Title *</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Finalize API endpoint documentation"
            class={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.title ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'
            }`}
          />
          {errors.title && <p class="text-red-500 text-xs mt-1 font-medium">{errors.title}</p>}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Description (Optional)</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detailed scope or subtasks..."
            rows="3"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
          />
        </div>

        <div class="flex gap-2 justify-end">
          {editingTask && (
            <button 
              type="button" 
              onClick={clearEdit}
              class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium transition"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit"
            class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition"
          >
            {editingTask ? 'Save Updates' : 'Add to List'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;