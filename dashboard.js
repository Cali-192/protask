// ==========================================
// MBROJTJA: Kontrollo nëse përdoruesi është i kyçur
// ==========================================
if (!localStorage.getItem('proTaskUserName')) {
    window.location.href = "index.html"; // Ridrejto te faqja kryesore
}

// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // 0. Dark Mode Check (Aplikohet sapo ngarkohet DOM)
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-theme');
    }

    // 1. Ngarkimi i të dhënave
    const tasks = JSON.parse(localStorage.getItem('proTasksV2')) || [];
    const userName = localStorage.getItem('proTaskUserName') || 'Përdorues';
    
    // Përshëndetja inteligjente e përdoruesit
    const welcomeElem = document.getElementById('dashUser'); 
    const greetingText = document.getElementById('greetingText'); // Nëse e ke këtë ID në HTML

    if (welcomeElem) {
        welcomeElem.innerText = userName;
    }

    if (greetingText) {
        const hour = new Date().getHours();
        if (hour < 12) greetingText.innerText = "Mirëmëngjes,";
        else if (hour < 18) greetingText.innerText = "Mirëdita,";
        else greetingText.innerText = "Mirëmbrëma,";
    }

    // 2. Llogaritja e statistikave
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const efficiency = total === 0 ? 0 : Math.round((completed / total) * 100);

    // 3. Shfaqja e statistikave në Card-et kryesore
    const totalElem = document.getElementById('totalTasks');
    const completedElem = document.getElementById('completedTasks');
    const efficiencyElem = document.getElementById('efficiency');

    if (totalElem) totalElem.innerText = total;
    if (completedElem) completedElem.innerText = completed;
    if (efficiencyElem) efficiencyElem.innerText = efficiency + "%";

    // 4. Shfaq 3 detyrat e fundit (Aktiviteti i fundit)
    const recentList = document.getElementById('recentActivityList');
    if (recentList) {
        recentList.innerHTML = ""; // Pastro listën
        
        // Marrim 3 detyrat e fundit të shtuara (të renditura nga më e reja)
        const recentTasks = [...tasks].reverse().slice(0, 3);

        if (recentTasks.length === 0) {
            recentList.innerHTML = `
                <div class='p-4 text-center text-muted'>
                    <i class="fas fa-tasks mb-2 d-block fa-2x opacity-25"></i>
                    Nuk ka aktivitet kohët e fundit.<br>Shto një detyrë të re!
                </div>`;
        } else {
            recentTasks.forEach(t => {
                const item = document.createElement('div');
                item.className = "d-flex align-items-center mb-3 p-3 rounded-3 border-bottom activity-item";
                
                // Përcaktimi i ikonës bazuar në status
                const iconClass = t.completed ? 'fa-check-circle text-success' : 'fa-circle-notch fa-spin text-primary';
                
                item.innerHTML = `
                    <div class="rounded-circle bg-light p-3 me-3 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-0 fw-bold">${t.text}</h6>
                        <small class="text-muted">${t.category || 'Pa kategori'}</small>
                    </div>
                    <div class="status-badge">
                        <span class="badge ${t.completed ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'} rounded-pill" style="font-size: 0.7rem;">
                            ${t.completed ? 'E kryer' : 'Në proces'}
                        </span>
                    </div>
                `;
                recentList.appendChild(item);
            });
        }
    }

    // 5. Analiza e Kategorive (Progress Bars)
    const catStats = document.getElementById('categoryStats');
    if (catStats) {
        catStats.innerHTML = ""; // Pastro listën
        
        // nxjerrim listën e kategorive unike
        const categories = [...new Set(tasks.map(t => t.category).filter(c => c))];
        
        if (categories.length === 0) {
            catStats.innerHTML = "<p class='text-muted text-center small p-3'>Nuk ka të dhëna për kategoritë.</p>";
        } else {
            categories.forEach(cat => {
                const count = tasks.filter(t => t.category === cat).length;
                const completedInCat = tasks.filter(t => t.category === cat && t.completed).length;
                const perc = total === 0 ? 0 : Math.round((count / total) * 100);
                
                // Përcaktimi i ngjyrës së bar-it bazuar te kategoria
                let barColor = "bg-primary";
                if (cat.includes("Namazi")) barColor = "bg-dark";
                if (cat.includes("Urgjente")) barColor = "bg-danger";
                if (cat.includes("Fitness")) barColor = "bg-warning";

                const catItem = document.createElement('div');
                catItem.className = "mb-4";
                catItem.innerHTML = `
                    <div class="d-flex justify-content-between mb-2">
                        <small class="fw-bold">${cat}</small>
                        <small class="text-muted">${count} misione (${completedInCat} kryer)</small>
                    </div>
                    <div class="progress" style="height: 8px; border-radius: 10px; background-color: rgba(0,0,0,0.05);">
                        <div class="progress-bar ${barColor} shadow-sm" role="progressbar" style="width: ${perc}%" aria-valuenow="${perc}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                `;
                catStats.appendChild(catItem);
            });
        }
    }

    // 6. Feedback Vizual për Sidebar dhe Efekte
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', function() {
            this.style.transform = "scale(0.95)";
            setTimeout(() => { this.style.transform = "scale(1)"; }, 150);
        });
    });
});

// Funksioni Logout
function logout() {
    if(confirm("Dëshironi të dilni nga sistemi?")) {
        localStorage.removeItem('proTaskUserName');
        localStorage.removeItem('proTaskUserEmail');
        // Mos fshi 'proTasksV2' sepse duam që detyrat të mbeten kur të kyçet përsëri
        window.location.href = "index.html"; 
    }
}
