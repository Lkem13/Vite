import { v4 as uuidv4 } from 'uuid';
import ProjectModel from '../models/projectModel';
import apiService from '../services/apiService';
import { renderProjects } from './ProjectList';

const addProjectForm = () => {
  const addProjectForm = document.createElement('form');
  addProjectForm.innerHTML = `
    <label for="projectName">Project Name:</label>
    <input type="text" id="projectName" name="projectName" required>

    <label for="projectDescription">Project Description:</label>
    <textarea id="projectDescription" name="projectDescription" required></textarea>

    <button type="submit">Add Project</button>
  `;

  addProjectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
    const projectDescriptionInput = document.getElementById('projectDescription') as HTMLTextAreaElement;

    const projectName = projectNameInput.value;
    const projectDescription = projectDescriptionInput.value;

    if (projectName && projectDescription) {
      const newProject: ProjectModel = {
        id: uuidv4(),
        name: projectName,
        description: projectDescription,
      };

      apiService.addProject(newProject);
      const updatedProjects = apiService.getAllProjects();
      renderProjects(updatedProjects);

      projectNameInput.value = '';
      projectDescriptionInput.value = '';
    }
  });

  return addProjectForm;
};

export default addProjectForm;
