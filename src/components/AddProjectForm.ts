import { v4 as uuidv4 } from 'uuid';
import ProjectModel from '../models/projectModel';
import { renderProjects } from './ProjectList';
import axios from 'axios';

const addProjectForm = () => {
  const addProjectForm = document.createElement('form');
  addProjectForm.innerHTML = `
    <label for="projectName">Project Name:</label>
    <input type="text" id="projectName" name="projectName" required>

    <label for="projectDescription">Project Description:</label>
    <textarea id="projectDescription" name="projectDescription" required></textarea>

    <button type="submit">Add Project</button>
  `;

  addProjectForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
    const projectDescriptionInput = document.getElementById('projectDescription') as HTMLTextAreaElement;

    const projectName = projectNameInput.value;
    const projectDescription = projectDescriptionInput.value;

    if (projectName && projectDescription) {
      const newProject: ProjectModel = {
        _id: uuidv4(),
        name: projectName,
        description: projectDescription,
      };
      try{
        await axios.post('http://localhost:3000/projects', newProject);
        renderProjects();
        projectNameInput.value = '';
        projectDescriptionInput.value = '';
      } catch (error) {
          console.error('Failed to create project', error);
      }
    }
  });

  return addProjectForm;
};

export default addProjectForm;
