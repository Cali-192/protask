// ==========================================
// MBROJTJA: Kontrollo nëse përdoruesi është i kyçur
// ==========================================
if (!localStorage.getItem('proTaskUserName')) {
    window.location.href = "index.html"; // Ridrejtuar te faqja kryesore
}

// 1. Inicializimi i të dhënave
let tasks = JSON.parse(localStorage.getItem('proTasksV2')) || [];
const alarmSound = document.getElementById('alarmSound');

// Kërko leje për njoftime (Notifications)
if ("Notification" in window) {
    Notification.requestPermission();
}

// 2. Funksioni Init - Ekzekutohet kur ngarkohet faqja
function init() {
    // Apliko Dark Mode nëse është aktiv
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-theme');
    }

    renderTasks();
    updateProgress();
    updateDate();
    greetUser(); 
    
    // Kontrolli i Reminders çdo sekondë për saktësi maksimale (e rregulluar nga 10s)
    setInterval(checkReminders, 1000);

    // Dëgjuesi për tastin Enter në input
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addBtn').click();
            }
        });
    }
}

// Përshëndetja e përdoruesit
function greetUser() {
    const user = localStorage.getItem('proTaskUserName') || 'Përdorues';
    const welcomeUserElem = document.getElementById('welcomeUser');
    if (welcomeUserElem) {
        // Përdorim innerHTML për të mbajtur badge-in e taskCount
        welcomeUserElem.innerHTML = `Mirësevjen, ${user}! <span class="badge bg-primary-soft text-primary ms-2" id="taskCount">${tasks.length}</span>`;
    }
}

// Përditësimi i datës
function updateDate() {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateElem = document.getElementById('dateDisplay');
    if (dateElem) {
        dateElem.innerText = new Date().toLocaleDateString('sq-AL', options);
    }
}

// 3. SHTIMI DHE EDITIMI I NJË DETYRE
const addBtn = document.getElementById('addBtn');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        const textInput = document.getElementById('taskInput');
        const timeInput = document.getElementById('timeInput');
        const catInput = document.getElementById('categoryInput');
        const editIdInput = document.getElementById('editTaskId'); // Fusha e fshehtë nga HTML

        const text = textInput.value.trim();
        const time = timeInput.value;
        const cat = catInput.value;

        if (!text || !time) {
            alert("Ju lutem plotësoni detyrën dhe orarin!");
            return;
        }

        if (editIdInput && editIdInput.value) {
            // LOGJIKA E PËRDITËSIMIT (EDIT)
            tasks = tasks.map(t => t.id == editIdInput.value ? { 
                ...t, text: text, time: time, category: cat, notified: false 
            } : t);
            editIdInput.value = "";
            addBtn.innerHTML = '<i class="fas fa-plus me-2"></i>Shto';
        } else {
            // LOGJIKA E SHTIMIT TË RI
            const newTask = {
                id: Date.now(),
                text: text,
                time: time,
                category: cat,
                completed: false,
                notified: false
            };
            tasks.push(newTask);
        }

        saveAndRefresh();
        
        // Pastro fushat
        textInput.value = "";
        timeInput.value = "";
        textInput.focus();
    });
}

// FUNKSIONI I EDITIMIT (Plotëson formën)
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('taskInput').value = task.text;
    document.getElementById('timeInput').value = task.time;
    document.getElementById('categoryInput').value = task.category;
    document.getElementById('editTaskId').value = task.id;

    const addBtn = document.getElementById('addBtn');
    addBtn.innerHTML = '<i class="fas fa-save me-2"></i>Përditëso';
    
    document.getElementById('taskInput').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. LOGJIKA E PROGRESIT
function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const perc = total === 0 ? 0 : Math.round((done / total) * 100);
    
    const progressText = document.getElementById('progressText');
    const taskCountBadge = document.getElementById('taskCount');
    if (progressText) progressText.innerText = perc + "%";
    if (taskCountBadge) taskCountBadge.innerText = total;

    const circle = document.getElementById('progressCircle');
    if (circle) {
        circle.setAttribute('stroke-dasharray', `${perc}, 100`);
    }
}

// 5. RENDERING I DETYRAVE
function renderTasks(filter = 'all', searchTerm = '') {
    const list = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    if (!list) return;
    
    list.innerHTML = "";

    let filteredTasks = tasks.filter(t => {
        const matchesFilter = filter === 'all' ? true : (filter === 'completed' ? t.completed : !t.completed);
        const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (filteredTasks.length === 0) {
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (emptyState) emptyState.style.display = "none";
    }

    // Renditja sipas kohës
    filteredTasks.sort((a, b) => new Date(a.time) - new Date(b.time));

    filteredTasks.forEach(t => {
        const div = document.createElement('div');
        div.className = `task-item ${t.completed ? 'completed' : ''}`;
        
        // Përcaktimi i stilit sipas kategorisë
        let catClass = "bg-info text-white"; 
        let catIcon = '<i class="fas fa-user me-1"></i>';

        if (t.category.includes("Urgjente")) {
            catClass = "bg-danger text-white"; 
            catIcon = '<i class="fas fa-exclamation-circle me-1"></i>';
        } else if (t.category.includes("Punë")) {
            catClass = "bg-primary text-white";
            catIcon = '<i class="fas fa-briefcase me-1"></i>';
        } else if (t.category.includes("Fitness")) {
            catClass = "bg-warning text-dark";
            catIcon = '<i class="fas fa-dumbbell me-1"></i>';
        } else if (t.category.includes("Namazi")) {
            catClass = "bg-dark text-white";
            catIcon = '<i class="fas fa-mosque me-1"></i>';
        }

        div.innerHTML = `
            <div class="d-flex align-items-center flex-grow-1">
                <div class="custom-checkbox" onclick="toggleTask(${t.id})">
                    ${t.completed ? '<i class="fas fa-check fa-xs"></i>' : ''}
                </div>
                <div class="task-info">
                    <div class="task-text fw-bold">${t.text}</div>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <small class="text-muted"><i class="far fa-clock me-1"></i>${t.time.replace('T', ' • ')}</small>
                        <span class="badge ${catClass} badge-category">
                            ${catIcon} ${t.category}
                        </span>
                    </div>
                </div>
            </div>
            <div class="actions d-flex gap-2">
                <button class="btn btn-link text-primary p-0" onclick="editTask(${t.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-link text-danger p-0" onclick="deleteTask(${t.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        list.appendChild(div);
    });
}

// 6. FUNKSIONET INTERAKTIVE
function toggleTask(id) {
    tasks = tasks.map(t => {
        if (t.id === id) {
            // Efekti Confetti vetëm kur kompletohet
            if (!t.completed && typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.8 },
                    colors: ['#4361ee', '#4cc9f0', '#2ec4b6']
                });
            }
            return { ...t, completed: !t.completed };
        }
        return t;
    });
    saveAndRefresh();
}

function deleteTask(id) {
    if (confirm("A jeni i sigurt që dëshironi ta fshini këtë mision?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRefresh();
    }
}

// Search logic
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const activeBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';
        renderTasks(activeFilter, e.target.value);
    });
}

// 7. REMINDERS DHE ALARMET (Rregulluar për saktësi sekondash)
function checkReminders() {
    const now = new Date();
    // Formatimi për krahasim: YYYY-MM-DDTHH:MM
    const currentStr = now.getFullYear() + "-" + 
        String(now.getMonth() + 1).padStart(2, '0') + "-" + 
        String(now.getDate()).padStart(2, '0') + "T" + 
        String(now.getHours()).padStart(2, '0') + ":" + 
        String(now.getMinutes()).padStart(2, '0');

    tasks.forEach(t => {
        if (!t.completed && !t.notified && t.time === currentStr) {
            triggerAlarm(t);
        }
    });
}

function triggerAlarm(task) {
    task.notified = true;
    saveAndRefresh();
    
    if (alarmSound) {
        alarmSound.currentTime = 0; // Rifillo nga fillimi
        alarmSound.play().catch(() => console.log("Audio bllokuar nga browser-i"));
    }

    if (Notification.permission === "granted") {
        new Notification("ProTask: Koha për " + task.text, {
            body: `Misioni: ${task.text} - Stay Hard!`,
            icon: "https://cdn-icons-png.flaticon.com/512/2098/2098402.png"
        });
    }
}

// 8. FILTRAT
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const sInput = document.getElementById('searchInput');
        renderTasks(e.target.dataset.filter, sInput ? sInput.value : '');
    });
});

// 9. RUJTJA DHE RRIFRESHIMI
function saveAndRefresh() {
    localStorage.setItem('proTasksV2', JSON.stringify(tasks));
    
    const activeBtn = document.querySelector('.filter-btn.active');
    const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';
    
    const sInput = document.getElementById('searchInput');
    
    renderTasks(activeFilter, sInput ? sInput.value : '');
    updateProgress();
    greetUser(); // Rifreskon numrin te badge-i
}

// 10. FUNKSIONI LOGOUT
function logout() {
    if(confirm("Dëshironi të dilni?")) {
        localStorage.removeItem('proTaskUserName');
        localStorage.removeItem('proTaskUserEmail');
        window.location.href = "index.html";
    }
}

// Nis aplikacionin
init();

// ==========================================
// REGJISTRIMI I PWA (Service Worker)
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('ProTask Service Worker u regjistrua!', reg);
    }).catch(err => {
      console.log('Dështoi regjistrimi i SW', err);
    });
  });
}
