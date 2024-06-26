import './style.css';
import ProjectModel from './models/projectModel';
import apiService from './services/apiService';
import User, { Role } from './models/User';
import { createLoginForm } from './components/Login'
import axios from 'axios';


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

const response = await axios.get('http://localhost:3000/projects/1');
console.log(response.status);
if (response.status === 200) {
    const project: ProjectModel = {
        _id: '1',
        name: 'Sample Project',
        description: 'This is a sample project.',
    };
    await axios.post('http://localhost:300/projects', project);
    console.log('test');
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


