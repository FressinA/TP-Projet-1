document.getElementById('RegisterButton').addEventListener('click', async function() {
    const login = document.getElementById('Login').value;
    const password = document.getElementById('Password').value;

    if (login && password) {
        try {
            const response = await fetch('http://192.168.64.155:3225/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });

            if (response.ok) {
                const results = await response.json();
                console.log('Register successful:', results);
                document.cookie = `reco=${login}; path=/`;
                window.location.href = 'index.html'; // Redirection vers la page d'accueil
            } else if (response.status === 401 || response.status === 409) {
                const errorText = await response.json();
                console.error('Register failed:', errorText.error);
            } else {
                console.error('Register failed: An error occurred');
            }
        } catch (error) {
            console.error('An error occurred during register:', error);
        }
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});
