import { v4 as uuidv4 } from 'uuid';
import ProjectModel from '../models/projectModel';
import { renderProjects } from './ProjectList';
import axios from 'axios';

const addProjectForm = () => {
  const addProjectForm = document.createElement('div');
  addProjectForm.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');
  addProjectForm.innerHTML = `
    <div class="bg-white dark:bg-gray-800 p-8 rounded-md shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add Project</h2>
      <form id="addProjectForm" class="space-y-4">
        <label for="projectName" class="block text-gray-700 dark:text-gray-300">Project Name:</label>
        <input type="text" id="projectName" name="projectName" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>

        <label for="projectDescription" class="block text-gray-700 dark:text-gray-300">Project Description:</label>
        <textarea id="projectDescription" name="projectDescription" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-32 resize-none" required></textarea>

        <div class="flex justify-end space-x-2">
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">Add Project</button>
          <button id="closeProjectButton" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Close</button>
        </div>
      </form>
    </div>
  `;

  const closeButton = addProjectForm.querySelector('#closeProjectButton');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      addProjectForm.remove();
    });
  }

  const addProjectFormSubmit = addProjectForm.querySelector('#addProjectForm');
  if (addProjectFormSubmit) {
    addProjectFormSubmit.addEventListener('submit', async (event) => {
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
        try {
          await axios.post('http://localhost:3000/projects', newProject);
          renderProjects();
          projectNameInput.value = '';
          projectDescriptionInput.value = '';
          addProjectForm.remove();
        } catch (error) {
          console.error('Failed to create project', error);
        }
      }
    });
  }

  return addProjectForm;
};

export default addProjectForm;

