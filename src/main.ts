import './style.css';
import ProjectModel from './models/projectModel';
import apiService from './services/apiService';
import User, { Role } from './models/User';
import { createLoginForm } from './components/Login'


//const currentUser = apiService.getCurrentUser();

const appDiv = document.getElementById('app');
if (appDiv) {
    const loginForm = createLoginForm();
    appDiv.appendChild(loginForm);
}

//mock
const currentUser = apiService.getUserById('1');

if (currentUser) {
    console.log('Zalogowano: ', currentUser.name,', Role: ', currentUser.role);
} else {
    console.log('Guest');
}

if (!apiService.getProjectById('1')) {
    const project: ProjectModel = {
        id: '1',
        name: 'Sample Project',
        description: 'This is a sample project.',
    };
    apiService.addProject(project)
}


if (!apiService.getUserById('1')) {
    const admin: User = {
        id: '1',
        name: 'David',
        surname: 'Strong',
        role: Role.Admin,
    };
    apiService.addUser(admin);
}

if (!apiService.getUserById('2')) {
    const devops: User = {
        id: '2',
        name: 'John',
        surname: 'Mike',
        role: Role.DevOPS,
    };
    apiService.addUser(devops);
}

if (!apiService.getUserById('3')) {
    const developer: User = {
        id: '3',
        name: 'Roger',
        surname: 'Sting',
        role: Role.Developer,
    };
    apiService.addUser(developer);
}


