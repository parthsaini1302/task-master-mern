import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'; // NEW: Toast notifications
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NEW STATES: Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'done'

  useEffect(() => {
    fetchTasks();
  }, []);

  // NEW: Escape Key Listener for canceling edits
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && editingTask) {
        setEditingTask(null);
        toast('Edit cancelled', { icon: '⌨️', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingTask]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setTasks(response.data);
    } catch (err) {
      toast.error('Failed to sync with server');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        const response = await axios.put(`${API_BASE_URL}/${editingTask._id}`, formData);
        setTasks(tasks.map(t => t._id === editingTask._id ? response.data : t));
        setEditingTask(null);
        toast.success('Task scope updated!');
      } else {
        const response = await axios.post(API_BASE_URL, formData);
        setTasks([response.data, ...tasks]);
        toast.success('New task added to matrix!');
      }
    } catch (err) {
      toast.error('Submission failed. Check connection.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${task._id}`, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
      if (!task.completed) {
        toast.success('Task completed! Great job! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task permanently deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete all tasks? This action cannot be undone.")) return;
    try {
      await axios.delete(API_BASE_URL);
      setTasks([]);
      toast.success('Matrix completely cleared');
    } catch (err) {
      toast.error('Failed to clear matrix');
    }
  };

  // NEW: Advanced Filtering Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filter === 'pending') return !task.completed && matchesSearch;
    if (filter === 'done') return task.completed && matchesSearch;
    return matchesSearch; 
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="h-screen w-full bg-slate-50/50 flex justify-center overflow-hidden antialiased selection:bg-indigo-500 selection:text-white relative">
      
      {/* Toast Notification Container */}
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="w-full max-w-7xl h-full flex flex-col md:flex-row gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 overflow-hidden">
        
        {/* LEFT COLUMN: Static Controls */}
        <div className="w-full md:w-96 lg:w-5/12 flex flex-col shrink-0 h-full overflow-y-auto pr-2 pb-6 md:pb-0">
          
          <div className="text-left mb-6 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 mb-3 tracking-widest uppercase">
              MERN Workspace v1.0
            </span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              Task<span className="text-indigo-600 font-extrabold">Master</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-sm">
              Organized workspace tracking internal fullstack parameters dynamically.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center transition hover:shadow-md">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold text-slate-800 mt-0.5 block">{tasks.length}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center transition hover:shadow-md cursor-pointer hover:bg-amber-50" onClick={() => setFilter('pending')}>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
              <span className="text-xl font-bold text-amber-600 mt-0.5 block">{pendingCount}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center transition hover:shadow-md cursor-pointer hover:bg-emerald-50" onClick={() => setFilter('done')}>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Done</span>
              <span className="text-xl font-bold text-emerald-600 mt-0.5 block">{completedCount}</span>
            </div>
          </div>

          <div className="transform transition-all duration-300 flex-shrink-0">
            <TaskForm onSubmit={handleCreateOrUpdate} editingTask={editingTask} clearEdit={() => setEditingTask(null)} />
          </div>
        </div>

        {/* RIGHT COLUMN: The Scrollable Task Feed */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden h-full relative">
          
          {/* List Header & Controls */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 bg-white z-10 shrink-0 shadow-sm">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Task Matrix</h2>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              
              {tasks.length > 0 && (
                <button onClick={handleDeleteAll} className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition duration-150 flex items-center gap-1.5 uppercase tracking-wide">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  Clear Matrix
                </button>
              )}
            </div>

            {/* NEW: Search and Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-lg shrink-0">
                {['all', 'pending', 'done'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all duration-200 ${
                      filter === f ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Internal Scrollable Body Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50">
                <div className="animate-pulse flex flex-col items-center space-y-3">
                  <div className="h-2 w-24 bg-slate-300 rounded-full"></div>
                  <p className="text-xs text-slate-400 font-medium">Syncing matrix...</p>
                </div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
                </div>
                <p className="text-slate-600 font-bold text-sm">No results found.</p>
                <p className="text-slate-400 text-xs mt-1 max-w-xs">Adjust your search or filter settings.</p>
              </div>
            ) : (
              <div className="space-y-3 transition-all duration-500">
                {filteredTasks.map(task => (
                  <TaskItem 
                    key={task._id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={setEditingTask}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;