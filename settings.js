// ==========================================
// MBROJTJA: Kontrollo nëse përdoruesi është i kyçur
// ==========================================
if (!localStorage.getItem('proTaskUserName')) {
    window.location.href = "index.html"; 
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
    
    // Aplikimi i klasës në nivel dokumenti për konsistencë
    if (darkMode) {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
    }

    // 3. Aktivizo dëgjuesin për ndryshimin e Dark Mode
    if (darkSwitch) {
        darkSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                localStorage.setItem('darkMode', 'enabled');
                document.documentElement.classList.add('dark-theme');
                document.body.classList.add('dark-theme');
            } else {
                localStorage.setItem('darkMode', 'disabled');
                document.documentElement.classList.remove('dark-theme');
                document.body.classList.remove('dark-theme');
            }
        });
    }
});

// Ruaj Emrin dhe Përditëso Profilin
function saveProfile() {
    const nameInput = document.getElementById('userNameInput');
    if (nameInput) {
        const newName = nameInput.value.trim();
        const userEmail = localStorage.getItem('proTaskUserEmail'); 

        if (newName !== "") {
            // 1. Përditëso emrin e sesionit aktiv
            localStorage.setItem('proTaskUserName', newName);

            // 2. Përditëso emrin në listën kryesore të përdoruesve (proTaskUsers)
            let users = JSON.parse(localStorage.getItem('proTaskUsers')) || [];
            let userIndex = users.findIndex(u => u.email === userEmail);
            
            if (userIndex !== -1) {
                users[userIndex].name = newName;
                localStorage.setItem('proTaskUsers', JSON.stringify(users));
            }

            // 3. Njoftim vizual më profesional
            alert("Profili u përditësua me sukses, " + newName + "!");
            
            // Rifreskojmë faqen që të shpërndahen ndryshimet (p.sh. te sidebar-i)
            window.location.reload();
        } else {
            alert("Ju lutem shkruani një emër të vlefshëm!");
        }
    }
}

// Fshij të Gjitha të Dhënat (Reset total)
function clearAllData() {
    const confirmation = confirm("⚠️ KUJDES!\n\nKy veprim do të fshijë çdo mision, llogarinë tuaj dhe të gjitha cilësimet e ruajtura.\n\nA jeni plotësisht i sigurt?");
    
    if (confirmation) {
        // Kontroll i dytë për siguri ekstreme
        const secondConfirm = confirm("Vërtet dëshironi të fshini çdo gjë? Ky veprim nuk mund të kthehet mbrapsht.");
        
        if (secondConfirm) {
            localStorage.clear();
            alert("Sistemi u pastrua plotësisht.");
            window.location.href = "index.html";
        }
    }
}

// Funksioni Logout
function logout() {
    if(confirm("Dëshironi të dilni nga llogaria?")) {
        // Fshijmë kredencialet e sesionit aktiv
        localStorage.removeItem('proTaskUserName');
        localStorage.removeItem('proTaskUserEmail');
        
        // Dërgo përdoruesin në faqen e login-it
        window.location.href = "index.html";
    }
}
