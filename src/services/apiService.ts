import ProjectModel from "../models/projectModel";

export default class apiService{
    static getAllProjects(): ProjectModel[]{
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        return projects;
    }

    static addProject(project: ProjectModel) : void{
        const projects = this.getAllProjects();
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
    }
}