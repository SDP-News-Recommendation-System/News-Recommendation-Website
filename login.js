document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.text();
        console.log(data);
        alert('Login successful.');
        // Redirect to dashboard or main page after successful login
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    }
});
