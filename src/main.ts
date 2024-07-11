import './output.css';
import ProjectModel from './models/projectModel';
import User, { Role } from './models/User';
import { createLoginForm } from './components/Login';
import axios from 'axios';

const appDiv = document.getElementById('app');
if (appDiv) {
    const loginForm = createLoginForm();
    appDiv.appendChild(loginForm);
}

async function fetchAndAddProject() {
    try {
        const response = await axios.get('http://localhost:3000/projects/1');
        if (response.status === 200) {
            console.log('Project found:', response.data);
        } else {
            console.log('Project not found, creating a new one...');
            const newProject: ProjectModel = {
                _id: '1',
                name: 'Sample Project',
                description: 'This is a sample project.',
            };
            await axios.post('http://localhost:3000/projects', newProject);
            console.log('Project added');
        }
    } catch (error) {
        console.error('Error fetching or adding project:', error);
    }
}

fetchAndAddProject();
