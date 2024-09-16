document.getElementById('submitButton').addEventListener('click', function() {
    const login = document.getElementById('Login').value;
    const password = document.getElementById('Password').value;

    if (login && password) {
        alert('Connexion réussie!');
        // Redirection vers index.html
        window.location.href = 'index2.html';
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});