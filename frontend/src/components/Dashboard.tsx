import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  tags: string[];
  deadline?: string;
}

const SortableItem: React.FC<{ task: Task; onUpdate: (id: number, status: string) => void }> = ({ task, onUpdate }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded shadow mb-2">
      <h3 className="font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Tags: {task.tags.join(', ')}</p>
      <select value={task.status} onChange={(e) => onUpdate(task.id, e.target.value)} className="mt-2 p-1 border">
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>
  );
};

const DroppableColumn: React.FC<{ status: string; tasks: Task[]; onUpdate: (id: number, status: string) => void }> = ({ status, tasks, onUpdate }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded min-h-64">
      <h2 className="text-xl font-bold mb-4">{status}</h2>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <SortableItem key={task.id} task={task} onUpdate={onUpdate} />
        ))}
      </SortableContext>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', tags: '' });

  useEffect(() => {
    fetchTasks();
    fetchWeather();
    fetchAnalytics();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/tasks', { headers: { Authorization: `Bearer ${token}` } });
    setTasks(res.data);
  };

  const fetchWeather = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/weather', { headers: { Authorization: `Bearer ${token}` } });
      setWeather(res.data);
    } catch (error) {
      // No weather
    }
  };

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/analytics', { headers: { Authorization: `Bearer ${token}` } });
    setAnalytics(res.data);
  };

  const updateTaskStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/tasks/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const status = over.id as string;
      updateTaskStatus(active.id as number, status);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/tasks', {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      tags: newTask.tags.split(',').map(t => t.trim()),
    }, { headers: { Authorization: `Bearer ${token}` } });
    setNewTask({ title: '', description: '', priority: 'Medium', tags: '' });
    fetchTasks();
  };

  const groupedTasks = {
    [t('toDo')]: tasks.filter(t => t.status === 'To Do'),
    [t('inProgress')]: tasks.filter(t => t.status === 'In Progress'),
    [t('done')]: tasks.filter(t => t.status === 'Done'),
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{t('taskManager')}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">{t('logout')}</button>
      </div>

      <form onSubmit={createTask} className="mb-4 p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-bold mb-2">{t('addNewTask')}</h2>
        <input
          type="text"
          placeholder={t('title')}
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full p-2 mb-2 border"
          required
        />
        <textarea
          placeholder={t('description')}
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full p-2 mb-2 border"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className="w-full p-2 mb-2 border"
        >
          <option value="Low">{t('low')}</option>
          <option value="Medium">{t('medium')}</option>
          <option value="High">{t('high')}</option>
        </select>
        <input
          type="text"
          placeholder={t('tags')}
          value={newTask.tags}
          onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
          className="w-full p-2 mb-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{t('addTask')}</button>
      </form>

      {weather && (
        <div className="bg-blue-100 p-4 rounded mb-4">
          <h2 className="text-xl font-bold">{t('weatherIn')} {weather.city}</h2>
          <p>{weather.temperature}°C, {weather.description}</p>
        </div>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(groupedTasks).map(([status, taskList]) => (
            <DroppableColumn key={status} status={status} tasks={taskList} onUpdate={updateTaskStatus} />
          ))}
        </div>
      </DndContext>

      {analytics && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">{t('analytics')}</h2>
          <Bar
            data={{
              labels: Object.keys(analytics.tagDistribution),
              datasets: [{
                label: 'Tasks by Tag',
                data: Object.values(analytics.tagDistribution),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              }],
            }}
          />
          <p>{t('completedLastWeek')}: {analytics.completedLastWeek}</p>
          <p>{t('avgCompletionTime')}: {analytics.avgCompletionTimeHours.toFixed(2)} {t('hours')}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
