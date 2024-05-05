import ProjectModel from "../models/projectModel";

export default class apiService{
    private static apiKey = '1234';

    static getAllProjects(): ProjectModel[]{
        const projects = JSON.parse(localStorage.getItem(this.apiKey) || '[]');
        return projects;
    }

    static addProject(project: ProjectModel) : void{
        const projects = this.getAllProjects();
        projects.push(project);
        localStorage.setItem(this.apiKey, JSON.stringify(projects));
    }

    static deleteProject(projectId: string) : void{
        const projects = this.getAllProjects();
        const updatedProjects = projects.filter((project: ProjectModel) => project.id !== projectId);
        localStorage.setItem(this.apiKey, JSON.stringify(updatedProjects));
    }

    static editProject(project: ProjectModel) : void{
        const projects = this.getAllProjects();
        const updatedProjects = projects.map((p: ProjectModel) => {
            if(p.id === project.id){
                return project;
            }
            return p;
        });
        localStorage.setItem(this.apiKey, JSON.stringify(updatedProjects));
    }
}