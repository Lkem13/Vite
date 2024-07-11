import axios from 'axios';
import { renderProjects } from './ProjectList';
import createLayout from './layout';

export function createLoginForm(): HTMLDivElement {
    const form = document.createElement('div');
    form.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-md shadow-lg max-w-md w-full">
            <h2 class="text-3xl leading-7 font-bold mb-4 text-center text-gray-900 dark:text-white">Login Form</h2>
            <form id="loginForm">
                <label for="username" class="text-gray-700 dark:text-gray-300">Username:</label>
                <input type="text" id="username" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                <br><br>
                <label for="password" class="text-gray-700 dark:text-gray-300">Password:</label>
                <input type="password" id="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                <br><br>
                <button type="submit" class="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Login
                </button>
            </form>
            <div id="message" class="mt-4 text-gray-700 dark:text-gray-300"></div>
            <div id="message2" class="mt-2 text-gray-700 dark:text-gray-300"></div>
        </div>
    </div>
    <div class="bg-grape">test</div>
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
            const response = await axios.post('http://localhost:3000/users/login', {
                login: usernameInput.value,
                password: passwordInput.value,
            }, { withCredentials: true });

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
                        createLayout();
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