document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Marrim vlerat nga inputet
    // Përdorim .toLowerCase() për emailin që të mos ketë gabime nga shkronjat e mëdha
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const passInput = document.getElementById('password').value;

    // 2. Merri të gjithë përdoruesit e regjistruar nga LocalStorage
    const users = JSON.parse(localStorage.getItem('proTaskUsers')) || [];

    // 3. Kërko nëse ekziston një përdorues me këtë email dhe fjalëkalim
    const userFound = users.find(user => user.email.toLowerCase() === emailInput && user.pass === passInput);

    if (userFound) {
        // 4. Ruaj sessionin: Ruajmë emrin për Dashboard
        localStorage.setItem('proTaskUserName', userFound.name);
        
        // Opsionale: Ruajmë edhe emailin nëse na duhet më vonë
        localStorage.setItem('proTaskUserEmail', userFound.email);

        // 5. Efekti vizual i ngarkimit (UX)
        const btn = e.target.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Duke hyrë...';
        btn.disabled = true;

        // 6. Ridrejtimi pas 1.2 sekondave
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

// Kontrolli fillestar: Nëse është i loguar, dërgoje direkt te Dashboard
window.onload = function() {
    if (localStorage.getItem('proTaskUserName')) {
        window.location.href = "dashboard.html";
    }
    
    // Apliko Dark Mode nëse është i ruajtur
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-theme');
    }
};
