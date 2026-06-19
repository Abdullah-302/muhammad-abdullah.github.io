// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const statsText = document.getElementById('statsText');
const clearBtn = document.getElementById('clearBtn');
const allBtn = document.getElementById('allBtn');
const activeBtn = document.getElementById('activeBtn');
const completedBtn = document.getElementById('completedBtn');

// Filter state
let currentFilter = 'all';

// Initialize app
function init() {
    loadTodosFromStorage();
    render();
    attachEventListeners();
}

// Event listeners
function attachEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    clearBtn.addEventListener('click', clearCompleted);
    allBtn.addEventListener('click', () => setFilter('all'));
    activeBtn.addEventListener('click', () => setFilter('active'));
    completedBtn.addEventListener('click', () => setFilter('completed'));
}

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        alert('Please enter a task!');
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todos.push(todo);
    saveTodosToStorage();
    todoInput.value = '';
    todoInput.focus();
    render();
}

// Toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodosToStorage();
    render();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToStorage();
    render();
}

// Clear completed todos
function clearCompleted() {
    const completedCount = todos.filter(todo => todo.completed).length;
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    if (confirm(`Delete ${completedCount} completed task(s)?`)) {
        todos = todos.filter(todo => !todo.completed);
        saveTodosToStorage();
        render();
    }
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;
    allBtn.classList.remove('active');
    activeBtn.classList.remove('active');
    completedBtn.classList.remove('active');
    
    if (filter === 'all') allBtn.classList.add('active');
    if (filter === 'active') activeBtn.classList.add('active');
    if (filter === 'completed') completedBtn.classList.add('active');
    
    render();
}

// Filter todos
function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(todo => !todo.completed);
    }
    if (currentFilter === 'completed') {
        return todos.filter(todo => todo.completed);
    }
    return todos;
}

// Render UI
function render() {
    const filteredTodos = getFilteredTodos();
    
    // Clear list
    todoList.innerHTML = '';
    
    // Render todos
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No tasks to show</div>';
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }
    
    // Update stats
    const activeTodos = todos.filter(todo => !todo.completed).length;
    statsText.textContent = `${activeTodos} ${activeTodos === 1 ? 'task' : 'tasks'} remaining`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Local Storage
let todos = [];

function saveTodosToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromStorage() {
    const stored = localStorage.getItem('todos');
    todos = stored ? JSON.parse(stored) : [];
}

// Start the app
init();