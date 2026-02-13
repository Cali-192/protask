// ==========================================
// MBROJTJA: Kontrollo nëse përdoruesi është i kyçur
// ==========================================
if (!localStorage.getItem('proTaskUserName')) {
    window.location.href = "index.html"; // Ndryshuar në index.html si faqja kryesore e loginit
}

// calendar.js

document.addEventListener('DOMContentLoaded', function() {
    // --- LOGJIKA E DARK MODE ---
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
        document.body.classList.add('dark-theme');
    }

    const calendarEl = document.getElementById('calendar');
    
    // 1. Merri detyrat nga LocalStorage
    const tasks = JSON.parse(localStorage.getItem('proTasksV2')) || [];

    // 2. Konverto detyrat në "Events" për kalendarin
    const events = tasks.map(t => {
        let color = '#4361ee'; // Default Blu
        
        // Kontrolli i kategorive për ngjyrat
        if (t.category && t.category.includes("Urgjente")) color = "#ef233c"; // Kuqe
        else if (t.category && t.category.includes("Fitness")) color = "#ffb703"; // Portokalli
        else if (t.category && t.category.includes("Shëndeti")) color = "#2ec4b6"; // Jeshile
        else if (t.category && t.category.includes("Punë")) color = "#3a0ca3"; // Vjollcë
        else if (t.category && t.category.includes("Studime")) color = "#4cc9f0"; // Kaltër

        return {
            title: t.text,
            start: t.time, // Formati: "YYYY-MM-DDTHH:mm"
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
                category: t.category,
                completed: t.completed
            }
        };
    });

    // 3. Inicializo Kalendarin
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            // RREGULLIMI: Nëse ekrani është i vogël (Mobile), hape si LISTË, përndryshe si MUJA
            initialView: window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth',
            
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listMonth'
            },
            locale: 'sq', // Gjuha Shqipe
            events: events,
            eventClick: function(info) {
                const status = info.event.extendedProps.completed ? "✅ E përfunduar" : "⏳ Në proces";
                alert("📌 Misioni: " + info.event.title + 
                      "\n📂 Kategoria: " + info.event.extendedProps.category +
                      "\n📊 Statusi: " + status);
            },
            // Përshtatja automatike nëse rrotullon telefonin ose ndryshon madhësinë e dritares
            windowResize: function(view) {
                if (window.innerWidth < 768) {
                    calendar.changeView('listMonth');
                } else {
                    calendar.changeView('dayGridMonth');
                }
            },
            handleWindowResize: true
        });

        calendar.render();
    }
});

// Funksioni Logout (për Sidebar)
function logout() {
    if(confirm("Dëshironi të dilni?")) {
        localStorage.removeItem('proTaskUserName'); // Fshijmë sessionin
        window.location.href = "index.html";
    }
}
