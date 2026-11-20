const API = "/api/v1";

// ---------- HTML elements pakadna ----------
const guestSection = document.getElementById("guestSection");
const appSection = document.getElementById("appSection");
const loginLink = document.getElementById("loginLink");
const logoutBtn = document.getElementById("logoutBtn");
const welcome = document.getElementById("welcome");

const todoList = document.getElementById("todoList");
const completedList = document.getElementById("completedList");
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const prioritySelect = document.getElementById("prioritySelect");
const addBtn = document.getElementById("addBtn");
const tabs = document.querySelectorAll(".tab");
const completedToggle = document.getElementById("completedToggle");
const arrow = document.getElementById("arrow");

let allTodos = [];
let currentTab = "today";

// ---------- Screen badalna ----------
// Login hai: todos + Hello + Logout dikhao
function showApp(user) {
    guestSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    loginLink.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    welcome.classList.remove("hidden");
    welcome.textContent = "Hello, " + user.username; // textContent: XSS se safe
    loadTodos();
}

// Login nahi hai: message + Login button dikhao
function showGuest() {
    guestSection.classList.remove("hidden");
    appSection.classList.add("hidden");
    loginLink.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    welcome.classList.add("hidden");
    allTodos = [];
}

// ---------- Page khulte hi check: login hai ya nahi ----------
async function checkLogin() {
    const res = await fetch(`${API}/users/me`);
    if (!res.ok) return showGuest(); // 401 -> guest
    const result = await res.json();
    showApp(result.data); // getCurrentUser: data mein seedha user
}

// ---------- Logout ----------
logoutBtn.addEventListener("click", async () => {
    await fetch(`${API}/users/logout`, { method: "POST" });
    showGuest();
});

// ---------- Todos ----------
function isToday(dateString) {
    return new Date(dateString).toDateString() === new Date().toDateString();
}

async function loadTodos() {
    const res = await fetch(`${API}/todos`);
    if (res.status === 401) return showGuest(); // token expire
    const result = await res.json();
    allTodos = result.data;
    render();
}

function render() {
    const pending = allTodos.filter((t) => !t.isComplete);
    const completed = allTodos.filter((t) => t.isComplete);
    const shown = currentTab === "today" ? pending.filter((t) => isToday(t.createdAt)) : pending;
    fillList(todoList, shown);
    fillList(completedList, completed);
}

function fillList(listEl, todos) {
    listEl.innerHTML = "";
    todos.forEach((todo) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.isComplete;
        checkbox.addEventListener("change", () => toggleTodo(todo._id));

        const title = document.createElement("span");
        title.className = "task-title" + (todo.isComplete ? " done" : "");
        title.textContent = todo.content;

        const date = document.createElement("span");
        date.className = "task-date";
        date.textContent = "🕒 " + new Date(todo.createdAt).toDateString();

        const pill = document.createElement("span");
        pill.className = "pill " + (todo.priority || "medium");

        const del = document.createElement("button");
        del.className = "del-btn";
        del.textContent = "🗑";
        del.addEventListener("click", () => deleteTodo(todo._id));

        li.append(checkbox, title, date, pill, del);
        listEl.appendChild(li);
    });
}

todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = todoInput.value.trim();
    if (!content) return;

    await fetch(`${API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, priority: prioritySelect.value }),
    });

    todoInput.value = "";
    todoForm.classList.add("hidden");
    loadTodos();
});

async function toggleTodo(id) {
    await fetch(`${API}/todos/${id}`, { method: "PATCH" });
    loadTodos();
}

async function deleteTodo(id) {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    loadTodos();
}

addBtn.addEventListener("click", () => {
    todoForm.classList.toggle("hidden");
    todoInput.focus();
});

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        if (tab.disabled) return;
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        currentTab = tab.dataset.tab;
        render();
    });
});

completedToggle.addEventListener("click", () => {
    completedList.classList.toggle("collapsed");
    arrow.textContent = completedList.classList.contains("collapsed") ? "▼" : "▲";
});

// ---------- Start ----------
checkLogin();