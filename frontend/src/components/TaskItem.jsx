import React from 'react';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  return (
    <div class={`p-5 bg-white border rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-between gap-4 group hover:shadow-md ${
      task.completed ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'
    }`}>
      <div class="flex gap-4 items-center min-w-0 flex-1">
        <div class="relative flex items-center justify-center shrink-0">
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={() => onToggleComplete(task)}
            class="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 transition duration-150"
          />
        </div>
        <div class="min-w-0 flex-1">
          <h4 class={`font-semibold text-slate-800 transition-all duration-300 truncate ${
            task.completed ? 'line-through text-slate-400' : 'text-slate-950'
          }`}>
            {task.title}
          </h4>
          {task.description && (
            <p class={`text-sm mt-0.5 transition-all duration-300 truncate ${
              task.completed ? 'text-slate-400/80 line-through' : 'text-slate-500'
            }`}>
              {task.description}
            </p>
          )}
          <div class="mt-2.5">
            <span class={`inline-flex items-center text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
              task.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {task.completed ? '✓ Completed' : '• Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Control Tray */}
      <div class="flex gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={() => onEdit(task)}
          class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition duration-150"
          title="Edit Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
        </button>
        <button 
          onClick={() => onDelete(task._id)}
          class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition duration-150"
          title="Delete Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;