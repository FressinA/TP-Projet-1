document.getElementById('RegisterSubmit').addEventListener('click', async function(event) {
    event.preventDefault();
    console.log("Début register...");
    const username = document.getElementById('login').value;
    const password = document.getElementById('passwrd').value;

    try {
        const response = await fetch('http://192.168.65.121:3225/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const results = await response.json();
            console.log('Register successful:', results);
            document.cookie = `reco=${username}; path=/`;
            window.location.href = 'index.html'; // Redirect user to successful login page
        } else if (response.status === 401 || response.status === 409) {
            const errorText = await response.json();
            console.error('Register failed:', errorText.error);
        } else {
            console.error('Register failed: An error occurred');
        }
    } catch (error) {
        console.error('An error occurred during register:', error);
    }
});