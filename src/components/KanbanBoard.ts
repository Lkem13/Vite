import axios from 'axios';
import { Status } from '../models/enums';
import TaskModel from '../models/taskModel';
import { renderHistoryList } from './HistoryList';

const renderKanbanBoard = async (historyId: string): Promise<void> => {
    const historiesResponse = await axios.get(`http://localhost:3000/histories/${historyId}`);
    const histories = historiesResponse.data;
    const tasksResponse = await axios.get(`http://localhost:3000/histories/${historyId}/tasks`);
    const tasks = tasksResponse.data;


    if (!history) {
        console.error(`History with ID ${historyId} not found.`);
        return;
    }

    console.log('Rendering Kanban board for history:', history);
    console.log('Tasks:', tasks);

    const kanbanContainer = document.getElementById('app');
    if (kanbanContainer) {
        kanbanContainer.innerHTML = `
            <div class="kanban-board">
            <button id="returnButton">Return</button>
                <h2>${histories.name} Kanban</h2>
                <div class="kanban-columns">
                    <div class="kanban-column" id="todo-column">
                        <h3>Todo</h3>
                        <div class="kanban-tasks" id="todo-tasks"></div>
                    </div>
                    <div class="kanban-column" id="doing-column">
                        <h3>Doing</h3>
                        <div class="kanban-tasks" id="doing-tasks"></div>
                    </div>
                    <div class="kanban-column" id="done-column">
                        <h3>Done</h3>
                        <div class="kanban-tasks" id="done-tasks"></div>
                    </div>
                </div>
            </div>
        `;

        const todoColumn = document.getElementById('todo-tasks');
        const doingColumn = document.getElementById('doing-tasks');
        const doneColumn = document.getElementById('done-tasks');

        if (todoColumn && doingColumn && doneColumn) {
            tasks.forEach((task: TaskModel) => {
                const taskElement = createTaskElement(task);
                if (task.status === Status.Todo) {
                    todoColumn.appendChild(taskElement);
                } else if (task.status === Status.Doing) {
                    doingColumn.appendChild(taskElement);
                } else if (task.status === Status.Done) {
                    doneColumn.appendChild(taskElement);
                }
            });

            const returnButton = document.getElementById('returnButton');
            if (returnButton) {
                returnButton.addEventListener('click', () => {
                    renderHistoryList(histories.project);
                });
            }
        }
    }
};

const createTaskElement = (task: TaskModel): HTMLElement => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('kanban-task');
    taskElement.innerHTML = `
        <div class="task-header">
            <h4>Name: ${task.name}</h4>
            <p>Status: ${task.status}</p>
        </div>
        <div class="task-details">
            <p>Description: ${task.description}</p>
            <p>Priority: ${task.priority}</p>
        </div>
    `;
    return taskElement;
};

export default renderKanbanBoard;
