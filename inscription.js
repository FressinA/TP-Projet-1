document.getElementById('registerButton').addEventListener('click', function(event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    const data = {
        login: login,
        passwd: password
    };

    fetch('http://192.168.64.155:3225/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Erreur d\'inscription');
            });
        }
        return response.json();
    })
    .then(result => {
        alert(result.message);
        window.location.href = 'connexion.html';
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert(error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.');
    });
});
