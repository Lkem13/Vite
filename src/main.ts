import './style.css';
import ProjectModel from './models/projectModel';
import apiService from './services/apiService';
import {renderProjects} from './components/ProjectList';

const project: ProjectModel = {
  id: '1',
  name: 'Sample Project',
  description: 'This is a sample project.',
};

apiService.addProject(project);
const projects = apiService.getAllProjects();
console.log('ProjectModel:', projects);
renderProjects(projects);
