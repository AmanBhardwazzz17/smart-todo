const API = "/api/v1";

// Toggle ka URL: apne todo.routes.js ke hisaab se rakho
//   toggle route /:id/toggle par hai  ->  `${API}/todos/${id}/toggle`   (abhi yahi laga hai)
//   toggle route /:id par hai         ->  `${API}/todos/${id}`
const toggleUrl = (id) => `${API}/todos/${id}`;

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

// Har request ke baad: 401 aaya to guest screen dikhao. true = 401 tha
function handle401(res) {
    if (res.status === 401) {
        showGuest();
        return true;
    }
    return false;
}

// Request fail hui to server ka message alert mein dikhao
async function showErrorIfFailed(res) {
    if (res.ok) return false;
    let message = "Kuch galat ho gaya";
    try {
        const data = await res.json();
        message = data.message || message;
    } catch (err) {
        // response JSON nahi tha, default message hi rahega
    }
    alert(message);
    return true;
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
    if (handle401(res)) return; // token expire
    const result = await res.json();
    allTodos = result.data;
    render();
}

function render() {
    const pending = allTodos.filter((t) => !t.isComplete);
    const completed = allTodos.filter((t) => t.isComplete);
    const shown = currentTab === "today" ? pending.filter((t) => isToday(t.createdAt)) : pending;
    fillList(todoList, shown, true);          // pending: AI button ke saath
    fillList(completedList, completed, false); // completed: AI button nahi
}

// withAI = true ho to har card mein "Break down" button lagega
function fillList(listEl, todos, withAI) {
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
        pill.className = "priority-pill " + (todo.priority || "medium").toLowerCase();
        pill.textContent = todo.priority || "medium";

        li.appendChild(checkbox);
        li.appendChild(title);
        li.appendChild(date);
        li.appendChild(pill);

        if (withAI) {
            const aiBtn = document.createElement("button");
            aiBtn.type = "button";
            aiBtn.className = "breakdown-btn";
            aiBtn.textContent = "Break down";
            aiBtn.addEventListener("click", () => breakDownTodo(todo._id));
            li.appendChild(aiBtn);
        }

        listEl.appendChild(li);
    });
}

async function toggleTodo(id) {
    const res = await fetch(toggleUrl(id), { method: "PATCH" });
    if (handle401(res)) return;
    if (await showErrorIfFailed(res)) return;
    await loadTodos();
}

async function breakDownTodo(id) {
    const res = await fetch(`${API}/todos/${id}/breakdown`, { method: "POST" });
    if (handle401(res)) return;
    if (await showErrorIfFailed(res)) return;
    await loadTodos();
}

todoForm.addEventListener("submit", async (event) => {
    event.preventEvent();
});

completedToggle.addEventListener("click", () => {
    completedList.classList.toggle("hidden");
    arrow.textContent = completedList.classList.contains("hidden") ? "▶" : "▼";
});

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
        currentTab = tab.dataset.tab;
        render();
    });
});

checkLogin();