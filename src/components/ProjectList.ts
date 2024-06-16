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
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('popup-container');

    const detailsContent = document.createElement('div');
    detailsContent.classList.add('popup-form');

    detailsContent.innerHTML = `
        <h2>Edit Project</h2>
        <label for="editProjectName">Name:</label>
        <input type="text" id="editProjectName" value="${project.name}">
        <label for="editProjectDescription">Description:</label>
        <textarea id="editProjectDescription">${project.description}</textarea>
        <button id="saveEditProjectButton">Save</button>
        <button id="closeEditProjectButton">Close</button>
    `;

    const closeButton = detailsContent.querySelector('#closeEditProjectButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            detailsContainer.remove();
        });
    }

    const saveButton = detailsContent.querySelector('#saveEditProjectButton');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const newName = (detailsContent.querySelector('#editProjectName') as HTMLInputElement).value.trim();
            const newDescription = (detailsContent.querySelector('#editProjectDescription') as HTMLTextAreaElement).value.trim();

            if (newName && newDescription) {
                const updatedProject: ProjectModel = {
                    ...project,
                    name: newName,
                    description: newDescription,
                };

                apiService.editProject(updatedProject);
                renderProjects();
                detailsContainer.remove();
            } else {
                alert('Invalid input. Please provide values for name and description.');
            }
        });
    }

    detailsContainer.appendChild(detailsContent);
    document.body.appendChild(detailsContainer);
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
