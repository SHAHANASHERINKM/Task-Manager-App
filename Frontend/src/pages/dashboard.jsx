import { useState, useEffect } from 'react';
import { getTasks, getTasksByStatus, addTask, updateTask, deleteTask } from '../services/taskService';
import './dashboard.css';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('All');
    const [editingTask, setEditingTask] = useState(null);

    const [newTitleError, setNewTitleError] = useState('');
    const [editTitleError, setEditTitleError] = useState('');

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Low',
    });
    const [loading, setLoading] = useState(true);

    // Fetch ALL tasks on mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data.tasks);
            } catch (err) {
                console.error(err);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        if (!newTask.title || !newTask.title.trim()) {
            setNewTitleError('Title is required');
            return;
        }
        setNewTitleError('');
        try {
            const data = await addTask(newTask);
            setTasks(prev => [data.task, ...prev]);
            setNewTask({
                title: '',
                description: '',
                dueDate: '',
                priority: 'Low',
            });
        } catch (err) {
            console.error(err);
        }
    };

    // Backend-based filter
    const handleFilter = async (status) => {
        setFilter(status);
        setLoading(true);
        try {
            let data;
            if (status === 'All') {
                data = await getTasks();
            } else {
                data = await getTasksByStatus(status);
            }
            setTasks(data.tasks);
        } catch (err) {
            console.error(err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };
    const handleEditClick = (task) => {
        setEditingTask({ ...task });
    };
    const handleUpdateTask = async () => {
        if (!editingTask.title || !editingTask.title.trim()) {
            setEditTitleError('Title is required');
            return;
        }
        setEditTitleError('');
        try {
            const data = await updateTask(editingTask._id, {
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate,
                status: editingTask.status,
            });

            // Update task list instantly
            setTasks(prev =>
                prev.map(task =>
                    task._id === data.task._id ? data.task : task
                )
            );

            setEditingTask(null); // close edit box
        } catch (err) {
            console.error(err);
        }
    };
    const handleDeleteTask = async (taskId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this task?'
        );

        if (!confirmed) return;

        try {
            await deleteTask(taskId);

            // Remove from UI instantly
            setTasks(prev => prev.filter(task => task._id !== taskId));
        } catch (err) {
            console.error('Delete failed', err);
            alert('Failed to delete task');
        }
    };

    const handleToggleStatus = async (task) => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        const confirmMsg = newStatus === 'Completed' ? 'Mark as completed?' : 'Mark as pending?';
        const confirmed = window.confirm(confirmMsg);
        if (!confirmed) return;

        try {
            // send status update
            const data = await updateTask(task._id, { status: newStatus });

            // update UI
            setTasks(prev => prev.map(t => (t._id === data.task._id ? data.task : t)));
        } catch (err) {
            console.error('Status update failed', err);
            alert('Failed to update status');
        }
    };



    return (
        <div className="dashboard-wrapper">
            {/* Navbar */}
            <nav className="navbar">
                <h2>Task Manager</h2>
                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('taskManagerUser');
                        window.location.href = '/';
                    }}
                >
                    Logout
                </button>
            </nav>

            {/* Add Task Card */}
            <div className="add-task-card">
                <h3 className="add-task-heading">Add New Task</h3>

                <input
                    type="text"
                    placeholder={newTitleError ? newTitleError : 'Task Title *'}
                    value={newTask.title}
                    onChange={(e) => {
                        setNewTask({ ...newTask, title: e.target.value });
                        if (newTitleError) setNewTitleError('');
                    }}
                    className={`task-input ${newTitleError ? 'error' : ''}`}
                />

                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newTask.description}
                     maxLength={50} 
                    onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="task-input"
                />

                <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="task-input"
                />

                <select
                    value={newTask.priority}
                    onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="task-input"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <button className="add-task-button" onClick={handleAddTask}>
                    Add Task
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {['All', 'Pending', 'Completed'].map(tab => (
                    <button
                        key={tab}
                        className={`filter-tab ${filter === tab ? 'active' : ''}`}
                        onClick={() => handleFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Task List */}
            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
                    {filter === 'Pending' ? 'No pending tasks.' : filter === 'Completed' ? 'No completed tasks.' : 'No tasks found. Add a new task to get started!'}
                </p>
            ) : (
                <div className="task-list">
                    {tasks.map(task => (
                        <div key={task._id} className="task-card">
                            {/* Header */}
                            <div className="task-header">
                                <div className="task-info">
                                    <input
                                        type="checkbox"
                                        className="status-checkbox"
                                        checked={task.status === 'Completed'}
                                        onChange={() => handleToggleStatus(task)}
                                        aria-label={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}
                                    />

                                    <div className="task-text">
                                        <h3>{task.title}</h3>
                                        {task.description && (
                                            <p className="task-desc">{task.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="task-actions">
                                    <button
                                        className="icon-btn edit-btn"
                                        onClick={() => handleEditClick(task)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => handleDeleteTask(task._id)}
                                    >
                                        🗑️
                                    </button>

                                </div>
                            </div>

                            {/* Footer */}
                            <div className="task-footer">
                                <span className={`task-priority ${task.priority.toLowerCase()}`}>
                                    {task.priority}
                                </span>

                                {task.dueDate && (
                                    <span className="task-due-date">
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>


            )}

            {editingTask && (
                <div className="edit-modal">
                    <div className="edit-card">
                        <h3>Edit Task</h3>

                        <input
                            type="text"
                            placeholder={editTitleError ? editTitleError : 'Task Title *'}
                            value={editingTask.title}
                            onChange={(e) => {
                                setEditingTask({ ...editingTask, title: e.target.value });
                                if (editTitleError) setEditTitleError('');
                            }}
                            className={`task-input ${editTitleError ? 'error' : ''}`}
                        />

                        <input
                            type="text"
                            value={editingTask.description}
                            onChange={(e) =>
                                setEditingTask({ ...editingTask, description: e.target.value })
                            }
                        />

                        <input
                            type="date"
                            value={editingTask.dueDate?.split('T')[0]}
                            onChange={(e) =>
                                setEditingTask({ ...editingTask, dueDate: e.target.value })
                            }
                        />

                        <select
                            value={editingTask.priority}
                            onChange={(e) =>
                                setEditingTask({ ...editingTask, priority: e.target.value })
                            }
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <div className="edit-actions">
                            <button onClick={handleUpdateTask}>Save</button>
                            <button onClick={() => setEditingTask(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Dashboard;
