import ProjectModel from '../models/projectModel';
import apiService from '../services/apiService';
import addProjectForm from './AddProjectForm';
import { renderHistoryList } from './HistoryList';


const renderProjects = (): void => {
    const currentProject = apiService.getCurrentProject();
    const appContainer = document.getElementById('app');

    if (appContainer) {
        appContainer.innerHTML = '';
        const projectList = document.createElement('ul');
        if (currentProject) {
            renderHistoryList(currentProject.id);
        } else {
            const projects = apiService.getAllProjects();
            projects.forEach((project) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Name: ${project.name} - Description: ${project.description}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => handleEdit(project));

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => handleRemove(project.id));

                const selectButton = document.createElement('button');
                selectButton.textContent = 'Select';
                selectButton.addEventListener('click', () => handleSelect(project));

                listItem.appendChild(editButton);
                listItem.appendChild(removeButton);
                listItem.appendChild(selectButton);

                projectList.appendChild(listItem);
            });
        }
        appContainer.appendChild(projectList);
        if (!currentProject) {
            appContainer.appendChild(addProjectForm());
        }
    }
};


const handleEdit = (project: ProjectModel): void => {
    const newName = prompt('Enter new project name:', project.name);
    const newDescription = prompt('Enter new project description:', project.description);

    if (newName !== null && newName.trim() !== '' && newDescription !== null && newDescription.trim() !== '') {
        const updatedProject: ProjectModel = {
            ...project,
            name: newName,
            description: newDescription,
        };

        apiService.editProject(updatedProject);
        renderProjects();
    } else {
        alert('Invalid input. Please provide non-empty values for name and description.');
    }
};

const handleRemove = (projectId: string): void => {
    const isConfirmed = confirm('Are you sure you want to remove this project?');

    if (isConfirmed) {
        apiService.deleteProject(projectId);
        renderProjects();
    }
};

const handleSelect = (project: ProjectModel): void => {
    apiService.setCurrentProject(project);
    console.log(apiService.getCurrentProject());
    renderProjects();
}

export { renderProjects };
