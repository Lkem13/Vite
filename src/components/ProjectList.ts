import axios from 'axios';
import ProjectModel from '../models/projectModel';
import apiService from '../services/apiService';
import { renderHistoryList } from './HistoryList';
import addProjectForm from './AddProjectForm';
import createLayout from './layout';

const renderProjects = async (): Promise<void> => {
    const currentProject = apiService.getCurrentProject();
    const appContainer = document.getElementById('app');
    createLayout();
    if (appContainer) {
        appContainer.innerHTML = '';
        
        const projectListContainer = document.createElement('div');
        projectListContainer.className = 'flex flex-col items-center';

        

        const addProjectButton = document.createElement('button');
        addProjectButton.textContent = 'Add Project';
        addProjectButton.className = 'mb-4 mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700';
        addProjectButton.addEventListener('click', handleAddProject);
        projectListContainer.appendChild(addProjectButton);

        const projectList = document.createElement('ul');
        projectList.className = 'space-y-4 w-full max-w-2xl';

        if (currentProject) {
            renderHistoryList(currentProject._id);
        } else {
            try {
                const projectsResponse = await axios.get('http://localhost:3000/projects');
                const projects = projectsResponse.data;
                projects.forEach((project: ProjectModel) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center max-w-xl';

                    const projectInfo = document.createElement('span');
                    projectInfo.innerHTML = `Name: ${project.name} <br> Description: ${project.description}`;
                    projectInfo.className = 'text-gray-900 dark:text-gray-200';

                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'space-x-2';

                    const editButton = document.createElement('button');
                    const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>`;
                    editButton.innerHTML = `${editIcon}`;
                    editButton.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                    editButton.addEventListener('click', () => handleEdit(project));

                    const removeButton = document.createElement('button');
                    const removeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>`;
                    removeButton.innerHTML = `${removeIcon}`;
                    removeButton.className = 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600';
                    removeButton.addEventListener('click', () => handleRemove(project._id));

                    const selectButton = document.createElement('button');
                    const selectIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                    </svg>`;
                    selectButton.innerHTML = `${selectIcon}`;
                    selectButton.className = 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600';
                    selectButton.addEventListener('click', () => handleSelect(project));

                    buttonContainer.appendChild(selectButton);
                    buttonContainer.appendChild(editButton);
                    buttonContainer.appendChild(removeButton);
                    

                    listItem.appendChild(projectInfo);
                    listItem.appendChild(buttonContainer);
                    
                    projectList.appendChild(listItem);
                });
            } catch (fetchError) {
                console.error('Failed to fetch projects:', fetchError);
            }
        }

        projectListContainer.appendChild(projectList);
        appContainer.appendChild(projectListContainer);
        
    }
};

const handleAddProject = (): void => {
    const appContainer = document.getElementById('app');
    if(appContainer){
        const form = addProjectForm();
        appContainer.appendChild(form);
    }
}


const handleEdit = (project: ProjectModel): void => {
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    const detailsContent = document.createElement('div');
    detailsContent.className = 'bg-white dark:bg-gray-800 p-8 rounded-md shadow-lg max-w-md w-full';

    detailsContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Project</h2>
        <label for="editProjectName" class="block text-gray-700 dark:text-gray-300">Name:</label>
        <input type="text" id="editProjectName" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" value="${project.name}">
        <label for="editProjectDescription" class="block text-gray-700 dark:text-gray-300 mt-4">Description:</label>
        <textarea id="editProjectDescription" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">${project.description}</textarea>
        <div class="mt-4 flex justify-end space-x-2">
            <button id="saveEditProjectButton" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
            <button id="closeEditProjectButton" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Close</button>
        </div>
    `;

    const closeButton = detailsContent.querySelector('#closeEditProjectButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            detailsContainer.remove();
        });
    }

    const saveButton = detailsContent.querySelector('#saveEditProjectButton');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            const newName = (detailsContent.querySelector('#editProjectName') as HTMLInputElement).value.trim();
            const newDescription = (detailsContent.querySelector('#editProjectDescription') as HTMLTextAreaElement).value.trim();

            if (newName && newDescription) {
                const updatedProject: ProjectModel = {
                    ...project,
                    name: newName,
                    description: newDescription,
                };

                await axios.put(`http://localhost:3000/projects/${project._id}`, updatedProject);
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

const handleRemove = async (projectId: string): Promise<void> => {
    const isConfirmed = confirm('Are you sure you want to remove this project?');

    if (isConfirmed) {
        try {
            await axios.delete(`http://localhost:3000/projects/${projectId}`);
            renderProjects();
        } catch (fetchError) {
            console.error('Failed to remove project:', fetchError);
        }
    }
};

const handleSelect = (project: ProjectModel): void => {
    apiService.setCurrentProject(project);
    renderProjects();
}


export { renderProjects, handleSelect };
