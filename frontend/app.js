const API = window.ENV_API_URL || 'http://localhost:8000';

let token = localStorage.getItem('token') || null;

// ---- INIT ----
window.onload = () => {
  if (token) showApp();
  else showAuth();
};

// ---- AUTH SCREENS ----
function showAuth() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('hidden');
}

function showApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  loadUser();
  loadTodos();
}

function switchTab(tab) {
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('form-register').classList.toggle('hidden', tab !== 'register');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
}

// ---- API HELPERS ----
async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Something went wrong');
  }
  if (res.status === 204) return null;
  return res.json();
}

// ---- AUTH ----
async function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');

  try {
    const form = new URLSearchParams({ username, password });
    const res = await fetch(`${API}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    if (!res.ok) throw new Error('Invalid username or password');
    const data = await res.json();
    token = data.access_token;
    localStorage.setItem('token', token);
    showApp();
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

async function register() {
  const username = document.getElementById('reg-username').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errEl    = document.getElementById('register-error');
  errEl.classList.add('hidden');

  try {
    await apiFetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    // auto-login after register
    document.getElementById('login-username').value = username;
    document.getElementById('login-password').value = password;
    switchTab('login');
    await login();
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  showAuth();
}

// ---- USER ----
async function loadUser() {
  try {
    const user = await apiFetch('/api/users/me');
    document.getElementById('username-display').textContent = user.username;
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    document.getElementById('greeting').textContent = `${greet}, ${user.username}.`;
  } catch {
    logout();
  }
}

// ---- TODOS ----
async function loadTodos() {
  try {
    const todos = await apiFetch('/api/todos/');
    renderTodos(todos);
  } catch {
    logout();
  }
}

function renderTodos(todos) {
  const list  = document.getElementById('todo-list');
  const empty = document.getElementById('empty-state');
  list.innerHTML = '';

  const pending   = todos.filter(t => !t.done);
  const completed = todos.filter(t => t.done);
  const ordered   = [...pending, ...completed];

  if (ordered.length === 0) {
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    ordered.forEach(t => list.appendChild(todoEl(t)));
  }

  const count = pending.length;
  document.getElementById('task-count').textContent =
    count === 0 ? 'All done!' : `${count} task${count !== 1 ? 's' : ''} remaining`;
}

function todoEl(todo) {
  const item = document.createElement('div');
  item.className = `todo-item${todo.done ? ' done' : ''}`;
  item.dataset.id = todo.id;

  const check = document.createElement('div');
  check.className = `todo-check${todo.done ? ' checked' : ''}`;
  check.onclick = () => toggleTodo(todo.id, !todo.done);

  const body = document.createElement('div');
  body.className = 'todo-body';

  const title = document.createElement('div');
  title.className = 'todo-title';
  title.textContent = todo.title;

  body.appendChild(title);

  if (todo.description) {
    const desc = document.createElement('div');
    desc.className = 'todo-desc';
    desc.textContent = todo.description;
    body.appendChild(desc);
  }

  const del = document.createElement('button');
  del.className = 'todo-delete';
  del.textContent = '×';
  del.onclick = () => deleteTodo(todo.id);

  item.appendChild(check);
  item.appendChild(body);
  item.appendChild(del);
  return item;
}

async function createTodo() {
  const title = document.getElementById('new-title').value.trim();
  const desc  = document.getElementById('new-desc').value.trim();
  if (!title) return;

  try {
    await apiFetch('/api/todos/', {
      method: 'POST',
      body: JSON.stringify({ title, description: desc || null }),
    });
    document.getElementById('new-title').value = '';
    document.getElementById('new-desc').value  = '';
    loadTodos();
  } catch (e) {
    alert(e.message);
  }
}

async function toggleTodo(id, done) {
  try {
    await apiFetch(`/api/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ done }),
    });
    loadTodos();
  } catch (e) {
    alert(e.message);
  }
}

async function deleteTodo(id) {
  try {
    await apiFetch(`/api/todos/${id}`, { method: 'DELETE' });
    loadTodos();
  } catch (e) {
    alert(e.message);
  }
}

// ---- ENTER KEY ----
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (!document.getElementById('app-screen').classList.contains('hidden')) {
      createTodo();
    }
  }
});