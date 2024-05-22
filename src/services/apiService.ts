import HistoryModel from "../models/HistoryModel";
import ProjectModel from "../models/projectModel";
import TaskModel from "../models/TaskModel";
import User from "../models/User";

export default class apiService{
    private static apiKey = '1234';
    private static userApiKey = 'user';
    private static currentProject: ProjectModel | null = null;
    private static historyApiKey = 'history';
    private static usersApiKey = 'users';
    private static tasksApiKey = 'tasks';

    static getAllProjects(): ProjectModel[]{
        const projects = JSON.parse(localStorage.getItem(this.apiKey) || '[]');
        return projects;
    }

    static getProjectById(projectId: string): ProjectModel | null {
        const projects = this.getAllProjects();
        return projects.find(project => project.id === projectId) || null;
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

        const histories = this.getAllHistories();
        const updatedHistories = histories.filter((history: HistoryModel) => history.project !== projectId);
        localStorage.setItem(this.historyApiKey, JSON.stringify(updatedHistories));
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

    static getCurrentUser(): User | null {
        const user = JSON.parse(localStorage.getItem(this.userApiKey) || '[]');
        return user;
    }

    static getAllUsers(): User[] {
        const users = JSON.parse(localStorage.getItem(this.usersApiKey) || '[]');
        return users.map((user: any) => new User(user.id, user.name, user.surname, user.role));
    }

    static getUserById(id: string): User | null {
        const users = this.getAllUsers();
        const user = users.find((user: User) => user.id === id);
        return user || null;
    }

    static addUser(user: User): void {
        const users = this.getAllUsers();
        users.push(user);
        localStorage.setItem(this.usersApiKey, JSON.stringify(users));
    }

    static getCurrentProject(): ProjectModel | null {
        return this.currentProject;
    }

    static setCurrentProject(project: ProjectModel | null): void {
        this.currentProject = project;
    }

    static getAllHistories(): HistoryModel[] {
        const history = JSON.parse(localStorage.getItem(this.historyApiKey) || '[]');
        return history
    }

    static getHistoriesByProjectId(projectId: string): HistoryModel[] {
        const histories = this.getAllHistories();
        return histories.filter((history: HistoryModel) => history.project === projectId);
    }

    static addHistory(history: HistoryModel): void {
        const historyList = this.getAllHistories();
        historyList.push(history);
        localStorage.setItem(this.historyApiKey, JSON.stringify(historyList));
    }

    static deleteHistory(historyId: string): void {
        const historyList = this.getAllHistories();
        const updatedHistory = historyList.filter((history: HistoryModel) => history.id !== historyId);
        localStorage.setItem(this.historyApiKey, JSON.stringify(updatedHistory));
    }

    static editHistory(history: HistoryModel): void {
        const historyList = this.getAllHistories();
        const updatedHistory = historyList.map((h: HistoryModel) => {
            if (h.id === history.id) {
                return history;
            }
            return h;
        });
        localStorage.setItem(this.historyApiKey, JSON.stringify(updatedHistory));
    }

    static getAllTasks(): TaskModel[] {
        const tasks = JSON.parse(localStorage.getItem(this.tasksApiKey) || '[]');
        return tasks;
    }

    static getTasksByHistoryId(historyId: string): TaskModel[] {
        const tasks = this.getAllTasks();
        return tasks.filter((task) => task.storyId === historyId);
    }

    static getTaskByName(taskName: string): TaskModel | null {
        const tasks = this.getAllTasks();
        return tasks.find(task => task.name === taskName) || null;
    }

    static addTask(task: TaskModel): void {
        const tasks = this.getAllTasks();
        tasks.push(task);
        localStorage.setItem(this.tasksApiKey, JSON.stringify(tasks));
    }
}
