const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    messageDiv.textContent = '';
    messageDiv.style.color = 'red';

    try {
        const response = await fetch('/api/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (result.success) {
            messageDiv.style.color = 'green';
            messageDiv.innerHTML = `Register successfully, please <a href='/login/'>Login</a>`
            form.reset();
        } else {
            messageDiv.textContent = result.message || 'Registration failed'
        }
    } catch (error) {
        messageDiv.textContent = 'Error, Try again';
    }
})
