// ==========================================
// MBROJTJA: Kontrollo nëse përdoruesi është i kyçur
// ==========================================
if (!localStorage.getItem('proTaskUserName')) {
    window.location.href = "index.html"; 
}

// calendar.js

document.addEventListener('DOMContentLoaded', function() {
    // --- LOGJIKA E DARK MODE ---
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
        document.body.classList.add('dark-theme');
    }

    const calendarEl = document.getElementById('calendar');
    
    // 1. Merri detyrat nga LocalStorage (proTasksV2)
    const tasks = JSON.parse(localStorage.getItem('proTasksV2')) || [];

    // 2. Konverto detyrat në "Events" për kalendarin
    const events = tasks.map(t => {
        let color = '#4361ee'; // Default Blu
        
        // Kontrolli i kategorive për ngjyrat (Sinkronizuar me todo.js dhe dashboard.js)
        if (t.category && t.category.includes("Urgjente")) color = "#ef233c"; // Kuqe
        else if (t.category && t.category.includes("Namazi")) color = "#1a1a1a"; // Dark/Black
        else if (t.category && t.category.includes("Fitness")) color = "#ffb703"; // Portokalli
        else if (t.category && t.category.includes("Shëndeti")) color = "#2ec4b6"; // Jeshile
        else if (t.category && t.category.includes("Punë")) color = "#3a0ca3"; // Vjollcë
        else if (t.category && t.category.includes("Studime")) color = "#4cc9f0"; // Kaltër

        // Stilimi nëse detyra është kryer
        let titleDisplay = t.text;
        if (t.completed) {
            titleDisplay = "✓ " + t.text;
        }

        return {
            title: titleDisplay,
            start: t.time, // Formati: "YYYY-MM-DDTHH:mm"
            backgroundColor: t.completed ? '#6c757d' : color, // Gri nëse është kryer
            borderColor: t.completed ? '#6c757d' : color,
            textColor: '#ffffff',
            classNames: t.completed ? ['task-completed'] : [],
            extendedProps: {
                category: t.category || 'Pa kategori',
                completed: t.completed
            }
        };
    });

    // 3. Inicializo Kalendarin
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            // Pamja fillestare: Listë për Mobile, Grid për Desktop
            initialView: window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth',
            
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listMonth'
            },
            
            // Konfigurimet estetike dhe funksionale
            locale: 'sq', 
            firstDay: 1, // E hëna si ditë e parë
            height: 'auto',
            events: events,
            editable: false,
            selectable: true,
            businessHours: true,
            nowIndicator: true,

            // Eventi kur klikohet një detyrë
            eventClick: function(info) {
                const statusIcon = info.event.extendedProps.completed ? "✅" : "⏳";
                const statusText = info.event.extendedProps.completed ? "E përfunduar" : "Në proces";
                
                // Krijojmë një mesazh më të bukur
                const alertMsg = `📌 Misioni: ${info.event.title.replace('✓ ', '')}\n` +
                                 `📂 Kategoria: ${info.event.extendedProps.category}\n` +
                                 `📊 Statusi: ${statusIcon} ${statusText}`;
                alert(alertMsg);
            },

            // Kur ndryshon madhësia e dritares
            windowResize: function(view) {
                if (window.innerWidth < 768) {
                    calendar.changeView('listMonth');
                } else {
                    calendar.changeView('dayGridMonth');
                }
            },

            // Stilimi i eventit (Shtohet viza nëse është kryer)
            eventDidMount: function(info) {
                if (info.event.extendedProps.completed) {
                    info.el.style.opacity = "0.7";
                    const titleEl = info.el.querySelector('.fc-event-title');
                    if (titleEl) {
                        titleEl.style.textDecoration = "line-through";
                    }
                }
            }
        });

        calendar.render();
    }
});

// Funksioni Logout
function logout() {
    if(confirm("Dëshironi të dilni nga sistemi?")) {
        // Largojmë vetëm kredencialet e sesionit, jo të dhënat e detyrave
        localStorage.removeItem('proTaskUserName');
        localStorage.removeItem('proTaskUserEmail');
        window.location.href = "index.html";
    }
}
