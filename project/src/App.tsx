import React, { useState } from 'react';
import { Task } from './types';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { Plus, ListFilter, ArrowUpDown, Boxes } from 'lucide-react';

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSubmit = (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, task);
      setEditingTask(null);
    } else {
      addTask(task);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    const element = e.target as HTMLElement;
    element.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.target as HTMLElement;
    element.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    moveTask(fromIndex, toIndex);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Boxes className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="gradient-text text-3xl font-bold">Task Manager</h1>
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
              <p className="text-gray-400">Organize and track your progress</p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 glass-panel rounded-lg px-3 py-2">
              <ListFilter className="w-5 h-5 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as Task['status'])}
                className="bg-transparent text-white border-none focus:ring-0"
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-2 glass-panel rounded-lg px-3 py-2">
              <ArrowUpDown className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white border-none focus:ring-0"
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="task-card"
              >
                <TaskCard
                  task={task}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                />
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No tasks yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          initialTask={editingTask || undefined}
        />
      )}
    </div>
  );
}

export default App;