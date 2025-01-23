import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, CheckCircle, Circle, Timer } from 'lucide-react';
import type { Task, TaskStatus } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.trim(),
      status: 'not_started',
      createdAt: new Date(),
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setNewTask(task.title);
  };

  const updateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !newTask.trim()) return;

    setTasks(tasks.map(task =>
      task.id === editingTask.id ? { ...task, title: newTask.trim() } : task
    ));
    setEditingTask(null);
    setNewTask('');
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Timer className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ma Liste de Tâches</h1>
        
        <form onSubmit={editingTask ? updateTask : addTask} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Ajouter une nouvelle tâche..."
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              {editingTask ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4"
            >
              <button
                onClick={() => {
                  const nextStatus: Record<TaskStatus, TaskStatus> = {
                    not_started: 'in_progress',
                    in_progress: 'completed',
                    completed: 'not_started',
                  };
                  updateTaskStatus(task.id, nextStatus[task.status]);
                }}
                className="flex-shrink-0"
              >
                {getStatusIcon(task.status)}
              </button>
              
              <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(task)}
                  className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune tâche pour le moment. Ajoutez-en une !
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;