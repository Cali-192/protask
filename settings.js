// ==========================================
// MBROJTJA: Kontrollo nëse përdoruesi është i kyçur
// ==========================================
if (!localStorage.getItem('proTaskUserName')) {
    window.location.href = "index.html"; // Ndryshuar në index.html
}

// settings.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ngarko emrin e ruajtur në input
    const savedName = localStorage.getItem('proTaskUserName');
    if (savedName) {
        const nameInput = document.getElementById('userNameInput');
        if (nameInput) nameInput.value = savedName;
    }

    // 2. Ngarko statusin e Dark Mode
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    const darkSwitch = document.getElementById('darkModeSwitch');
    
    if (darkSwitch) {
        darkSwitch.checked = darkMode;
    }
    
    if (darkMode) {
        document.body.classList.add('dark-theme');
    }
});

// Ruaj Emrin dhe Përditëso Profili
function saveProfile() {
    const nameInput = document.getElementById('userNameInput');
    if (nameInput) {
        const newName = nameInput.value.trim();
        const userEmail = localStorage.getItem('proTaskUserEmail'); // Marrim emailin e userit aktual

        if (newName !== "") {
            // Përditëso emrin e sesionit aktiv
            localStorage.setItem('proTaskUserName', newName);

            // Përditëso emrin në listën kryesore të përdoruesve (proTaskUsers)
            let users = JSON.parse(localStorage.getItem('proTaskUsers')) || [];
            let userIndex = users.findIndex(u => u.email === userEmail);
            
            if (userIndex !== -1) {
                users[userIndex].name = newName;
                localStorage.setItem('proTaskUsers', JSON.stringify(users));
            }

            alert("Profili u përditësua me sukses, " + newName + "!");
            window.location.reload();
        } else {
            alert("Ju lutem shkruani një emër të vlefshëm!");
        }
    }
}

// Dark Mode Toggle
const darkSwitch = document.getElementById('darkModeSwitch');
if (darkSwitch) {
    darkSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            localStorage.setItem('darkMode', 'enabled');
            document.body.classList.add('dark-theme');
        } else {
            localStorage.setItem('darkMode', 'disabled');
            document.body.classList.remove('dark-theme');
        }
    });
}

// Fshij të Gjitha të Dhënat (Reset total)
function clearAllData() {
    if (confirm("KUJDES! Ky veprim do të fshijë çdo detyrë, llogarinë tuaj dhe të gjitha cilësimet. A jeni i sigurt?")) {
        localStorage.clear();
        alert("Sistemi u pastrua plotësisht.");
        window.location.href = "index.html";
    }
}

// Funksioni Logout (për Sidebar)
function logout() {
    if(confirm("Dëshironi të dilni nga llogaria?")) {
        // Fshijmë vetëm emrin e sesionit, jo të dhënat e përdoruesit
        localStorage.removeItem('proTaskUserName');
        localStorage.removeItem('proTaskUserEmail');
        window.location.href = "index.html";
    }
}