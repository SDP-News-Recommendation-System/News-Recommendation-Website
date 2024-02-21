document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.text();
        console.log(data);
        alert('Registration successful. Please login.');
        window.location.href = 'login.html'; // Redirect to login page after successful registration
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
    }
});
