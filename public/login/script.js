const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('messageDiv');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    messageDiv.textContent = '';

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })

        if (!response.ok) {
            const errorText = await response.text();

            messageDiv.textContent = `Login failed: Server return status ${response.status}, message: ${errorText.substring(0, 50)}...`;

            return;
        }

        const result = await response.json()

        if (result.success) {
            window.location.href = '/todos/';
        } else {
            messageDiv.textContent = result.message || 'Login failed';
        }
    } catch (error) {
        console.error(`Network or Parsing Error:`, error);
        messageDiv.textContent = 'Connection or data parsing Error, Please try again.';
    }
})
