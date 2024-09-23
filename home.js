document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Token existe ?
    if (!token) {
        alert('Vous devez être connecté pour voir cette page.');
        window.location.href = 'connexion.html';
        return;
    }

    fetch('http://192.168.64.155:3225/home', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur de chargement');
        }
        return response.text();
    })
    .then(message => {
        document.getElementById('welcomeMessage').textContent = message;
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    });

    // Déconnexion
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'connexion.html';
    });
});
