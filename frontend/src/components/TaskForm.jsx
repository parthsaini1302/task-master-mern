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
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 transition hover:shadow-md">
      <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        {editingTask ? '📝 Edit Task Scope' : '➕ Create New Task'}
      </h3>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Task Title *</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Finalize API endpoint documentation"
            class={`w-full px-4 py-2.5 bg-slate-50/50 border rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${
              errors.title ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
          />
          {errors.title && <p class="text-red-500 text-xs mt-1.5 font-semibold">{errors.title}</p>}
        </div>
        
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description (Optional)</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detailed scope parameters..."
            rows="3"
            class="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 resize-none"
          />
        </div>

        <div class="flex gap-2 justify-end pt-2">
          {editingTask && (
            <button 
              type="button" 
              onClick={clearEdit}
              class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 text-sm font-semibold transition duration-150"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit"
            class="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold shadow-sm hover:shadow transition duration-150"
          >
            {editingTask ? 'Save Updates' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;