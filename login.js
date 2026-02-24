// ==========================================
// LOGIN LOGIC - login.js
// ==========================================

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Marrim vlerat nga inputet
    // Përdorim .toLowerCase() për emailin që të mos ketë gabime nga shkronjat e mëdha/vogla
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const passInput = document.getElementById('password').value;

    // 2. Kontroll i thjeshtë nëse fushat janë bosh
    if (!emailInput || !passInput) {
        alert("Ju lutem plotësoni të gjitha fushat!");
        return;
    }

    // 3. Merri të gjithë përdoruesit e regjistruar nga LocalStorage
    const users = JSON.parse(localStorage.getItem('proTaskUsers')) || [];

    // 4. Kërko nëse ekziston një përdorues me këtë email dhe fjalëkalim
    const userFound = users.find(user => user.email.toLowerCase() === emailInput && user.pass === passInput);

    if (userFound) {
        // 5. Ruaj sessionin: Ruajmë të dhënat kryesore për aplikacionin
        localStorage.setItem('proTaskUserName', userFound.name);
        localStorage.setItem('proTaskUserEmail', userFound.email);

        // 6. Efekti vizual i ngarkimit (UX)
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Duke hyrë...';
        btn.disabled = true;

        // 7. Ridrejtimi pas një vonese të shkurtër për efekt vizual
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);

    } else {
        // Nëse të dhënat nuk përputhen
        alert("Email ose fjalëkalimi është i gabuar! Provoni përsëri ose regjistrohuni.");
        
        // Pastrojmë fjalëkalimin për siguri
        document.getElementById('password').value = "";
    }
});

// Kontrolli fillestar kur hapet faqja
window.addEventListener('DOMContentLoaded', function() {
    // A) Nëse është i loguar, dërgoje direkt te Dashboard
    if (localStorage.getItem('proTaskUserName')) {
        window.location.href = "dashboard.html";
    }
    
    // B) Apliko Dark Mode nëse është i ruajtur nga sesionet e kaluara
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
    }
});
