import React, { useState, useEffect} from 'react'
import './styles.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState("")
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("todoTasks")) || []
    setTasks(storedTasks)
  }, []);
  
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("todoTasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const handleAddTask = () => {
    if (taskInput.trim() === "") return

    if(editingId !== null) {
      setTasks(tasks.map(task =>
        task.id === editingId ? {...task, text: taskInput} : task
      ))
      setEditingId(null)
    } else {
      const newTask = {
        id: Date.now(),
        text : taskInput,
        completed: false
      }
      setTasks([...tasks, newTask])
    }
    setTaskInput("")
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      handleAddTask()
    }
  }

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id)
    setTaskInput(taskToEdit.text)
    setEditingId(id)
  }

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    ))
  }

  return (
    <div className="app">
      <h1>📝 To-Do List</h1>
      <div className="input-section">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter task..."
        />
        <button onClick={handleAddTask}>
          {editingId !== null ? "Update" : "Add"}
        </button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li
            key={task.id}
            className={task.completed ? "completed" : ""}
            onClick={() => toggleComplete(task.id)}
          >
            <span>{task.text}</span>
            <div className="actions" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleEditTask(task.id)}>✏️</button>
              <button onClick={() => handleDeleteTask(task.id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
