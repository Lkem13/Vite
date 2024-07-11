import apiService from "../services/apiService";
import axios from "../services/axiosInstance";
import { handleSelect } from './ProjectList';

const createLayout = async (): Promise<void> => {
    const appContainer = document.getElementById('layout');
    
    if (appContainer) {
        const currentProject = apiService.getCurrentProject();
        const currentProjectName = currentProject ? currentProject.name : 'No project selected';

        async function getUserName() {
            try {
                const response = await axios.get('/users/me');
                return response.data.name;
            } catch (error) {
                console.error('Error fetching user data:', error);
                throw error;
            }
        }

        const userName = await getUserName();

        let projects: any[] = [];
        try {
            const response = await axios.get('http://localhost:3000/projects');
            projects = response.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
        }

        const projectOptions = projects
            .filter(project => !currentProject || project._id !== currentProject._id)
            .map(project => {
                return `<option value="${project._id}">${project.name}</option>`;
            }).join('');
        
        const darkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>`;

        appContainer.innerHTML = `
            <header class="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
            <h1>Hi, ${userName}</h1>
                <div class="ml-auto flex items-center">    
                    <span class="mr-4">Current Project: 
                        <select id="projectSelector" class="px-3 py-2 bg-gray-800 text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="" disabled selected>${currentProjectName}</option>
                            ${projectOptions}
                        </select>
                    </span>
                    <button id="toggleDarkMode" class="px-3 py-1 bg-gray-600 text-white rounded">${darkIcon}</button>
                    <button id="logoutButton" class="px-3 py-1 bg-red-600 text-white rounded ml-4">Logout</button>
                </div>
            </header>
        `;

        const toggleDarkModeButton = document.getElementById('toggleDarkMode');
        if (toggleDarkModeButton) {
            toggleDarkModeButton.addEventListener('click', toggleDarkMode);
        }

        const projectSelector = document.getElementById('projectSelector') as HTMLSelectElement;
        if (projectSelector) {
            projectSelector.addEventListener('change', () => {
                const selectedProjectId = projectSelector.value;
                const selectedProject = projects.find(project => project._id === selectedProjectId);
                if (selectedProject) {
                    handleSelect(selectedProject);
                }
            });
        }

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            });
        }
    }
};

const toggleDarkMode = () => {
    const body = document.body;
    body.classList.toggle('dark');
};

export default createLayout;
