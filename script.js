const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const taskItemTemplate = document.getElementById('taskItemTemplate');

const STORAGE_KEY = 'gtaskManager.tasks';
let tasks = [];
let editingTaskId = null;

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasks = saved ? JSON.parse(saved) : [];
}

function updateCount() {
  const count = tasks.length;
  taskCount.textContent = `${count} task${count !== 1 ? 's' : ''}`;
}

function resetInput() {
  taskInput.value = '';
  taskInput.focus();
  editingTaskId = null;
  addTaskBtn.textContent = 'Add Task';
}

function createTaskItem(task) {
  const fragment = taskItemTemplate.content.cloneNode(true);
  const item = fragment.querySelector('.task-item');
  const checkbox = fragment.querySelector('input[type="checkbox"]');
  const title = fragment.querySelector('.task-title');
  const editButton = fragment.querySelector('.edit-btn');
  const deleteButton = fragment.querySelector('.delete-btn');

  title.textContent = task.text;
  checkbox.checked = task.completed;
  item.dataset.id = task.id;

  if (task.completed) {
    item.classList.add('completed');
  }

  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    item.classList.toggle('completed', task.completed);
    saveTasks();
  });

  editButton.addEventListener('click', () => {
    taskInput.value = task.text;
    taskInput.focus();
    editingTaskId = task.id;
    addTaskBtn.textContent = 'Save';
  });

  deleteButton.addEventListener('click', () => {
    tasks = tasks.filter((entry) => entry.id !== task.id);
    renderTasks();
    saveTasks();
  });

  return item;
}

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="task-item"><span class="task-title">No tasks yet. Add one above.</span></li>';
  } else {
    tasks.forEach((task) => taskList.appendChild(createTaskItem(task)));
  }
  updateCount();
}

function getNextId() {
  return Date.now().toString();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  if (editingTaskId) {
    const targetTask = tasks.find((task) => task.id === editingTaskId);
    if (targetTask) {
      targetTask.text = text;
    }
  } else {
    tasks.unshift({
      id: getNextId(),
      text,
      completed: false,
    });
  }

  saveTasks();
  renderTasks();
  resetInput();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

function clearAllTasks() {
  if (!tasks.length) return;
  tasks = [];
  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
clearAllBtn.addEventListener('click', clearAllTasks);

loadTasks();
renderTasks();
