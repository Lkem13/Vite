import ProjectModel from '../models/projectModel';
import apiService from '../services/apiService';
import addProjectForm from './AddProjectForm';

const renderProjects = (projects: ProjectModel[]): void => {
  const appContainer = document.getElementById('app');

  if (appContainer) {
    const projectList = document.createElement('ul');
    projects.forEach((project) => {
      const listItem = document.createElement('li');

      listItem.textContent = `Name: ${project.name} - Description: ${project.description}`;

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => handleEdit(project));

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => handleRemove(project.id));

      listItem.appendChild(editButton);
      listItem.appendChild(removeButton);

      projectList.appendChild(listItem);
    });
    appContainer.innerHTML = '';
    appContainer.appendChild(projectList);
    appContainer.appendChild(addProjectForm());
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
    const updatedProjects = apiService.getAllProjects();
    renderProjects(updatedProjects);
  } else {
    alert('Invalid input. Please provide non-empty values for name and description.');
  }
};

const handleRemove = (projectId: string): void => {
  const isConfirmed = confirm('Are you sure you want to remove this project?');

  if (isConfirmed) {
    apiService.deleteProject(projectId);
    const updatedProjects = apiService.getAllProjects();
    renderProjects(updatedProjects);
  }
};

export { renderProjects };
