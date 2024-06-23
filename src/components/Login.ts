import axios from 'axios';
import { renderProjects } from './ProjectList';

export function createLoginForm(): HTMLDivElement {
    const form = document.createElement('div');
    form.innerHTML = `
    <h2>Login Form</h2>
    <form id="loginForm">
      <label for="username">Username:</label>
      <input type="text" id="username" required>
      <br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" required>
      <br><br>
      <button type="submit">Login</button>
    </form>
    <div id="message"></div>
    <div id="message2"></div>
  `;

    const loginForm = form.querySelector('#loginForm') as HTMLFormElement;
    const usernameInput = form.querySelector('#username') as HTMLInputElement;
    const passwordInput = form.querySelector('#password') as HTMLInputElement;
    const messageDiv = form.querySelector('#message') as HTMLDivElement;
    const messageDiv2 = form.querySelector('#message2') as HTMLDivElement;
    let i = 3;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/token', {
                username: usernameInput.value,
                password: passwordInput.value,
            });

            const { token, refreshToken } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            messageDiv.textContent = 'Login successful!';
            messageDiv2.textContent = `Redirecting in ${i} seconds...`;
            
            const interval = setInterval(async () => {
                i--;
                messageDiv2.textContent = `Redirecting in ${i} seconds...`;
                if (i < 1) {
                    clearInterval(interval);
                    try {
                        renderProjects();
                    } catch (fetchError) {
                        console.error('Failed to fetch projects:', fetchError);
                    }
                }
            }, 1000);
            

        } catch (error) {
            messageDiv.textContent = 'Login failed. Please check your credentials.';
            console.error('Login error:', error);
        }
    });

    return form;
}

export default createLoginForm;
