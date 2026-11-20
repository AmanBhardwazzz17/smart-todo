const API = "/api/v1";

// ---------- HTML elements pakadna ----------
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubmit = document.getElementById("authSubmit");
const authError = document.getElementById("authError");
const switchText = document.getElementById("switchText");
const switchLink = document.getElementById("switchLink");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

let isRegisterMode = false; // false = login, true = register

// ---------- Pehle se login hai to seedha todo page par bhejo ----------
async function checkAlreadyLoggedIn() {
    const res = await fetch(`${API}/users/me`);
    if (res.ok) window.location.href = "/";
}

// ---------- Login <-> Register badalna ----------
function setMode(register) {
    isRegisterMode = register;
    authError.textContent = "";
    authTitle.textContent = register ? "Register" : "Login";
    authSubmit.textContent = register ? "Register" : "Login";
    usernameInput.classList.toggle("hidden", !register); // username sirf register mein
    usernameInput.required = register;
    switchText.textContent = register ? "Pehle se account hai?" : "Account nahi hai?";
    switchLink.textContent = register ? "Login karo" : "Register karo";
}

switchLink.addEventListener("click", (e) => {
    e.preventDefault(); // link ka default jump rokna
    setMode(!isRegisterMode);
});

// ---------- Backend ko JSON bhejne ka helper ----------
async function postJSON(url, body) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return { ok: res.ok, data };
}

// ---------- Form submit ----------
authForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // page reload mat karo
    authError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Register mode: pehle register karo
    if (isRegisterMode) {
        const username = usernameInput.value.trim();
        const reg = await postJSON(`${API}/users/register`, { username, email, password });
        if (!reg.ok) {
            authError.textContent = reg.data.message; // jaise 409 already exists
            return;
        }
    }

    // Login (register ke baad bhi, kyunki cookie login se hi milti hai)
    const login = await postJSON(`${API}/users/login`, { email, password });
    if (!login.ok) {
        authError.textContent = login.data.message;
        return;
    }

    // Success: todo page par jao
    window.location.href = "/";
});

// ---------- Start ----------
setMode(false);
checkAlreadyLoggedIn();