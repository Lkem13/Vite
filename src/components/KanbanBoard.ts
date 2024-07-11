import axios from 'axios';
import { Status } from '../models/enums';
import TaskModel from '../models/taskModel';
import { renderHistoryList } from './HistoryList';

const renderKanbanBoard = async (historyId: string): Promise<void> => {
    const historiesResponse = await axios.get(`http://localhost:3000/histories/${historyId}`);
    const histories = historiesResponse.data;
    const tasksResponse = await axios.get(`http://localhost:3000/histories/${historyId}/tasks`);
    const tasks = tasksResponse.data;

    if (!histories) {
        console.error(`History with ID ${historyId} not found.`);
        return;
    }

    console.log('Rendering Kanban board for history:', histories);
    console.log('Tasks:', tasks);

    const kanbanContainer = document.getElementById('app');
    if (kanbanContainer) {
        kanbanContainer.innerHTML = `
            <div class="kanban-board">
                <button id="returnButton" class="bg-blue-500 text-white py-2 px-4 rounded mb-4">Return</button>
                <h1 class="text-xl mb-4 font-bold text-center text-gray-900 dark:text-white">Kanban board: ${histories.name}</h1>
                <div class="kanban-columns grid grid-cols-3 gap-4">
                    <div class="kanban-column bg-white dark:bg-gray-800 p-4 rounded">
                        <h2 class="text-lg mb-2 font-bold text-center text-gray-700 dark:text-gray-300">Todo</h2>
                        <div class="kanban-tasks space-y-4 text-gray-700 dark:text-gray-300" id="todo-tasks"></div>
                    </div>
                    <div class="kanban-column bg-white dark:bg-gray-800 p-4 rounded">
                        <h2 class="text-lg mb-2 font-bold text-center text-gray-700 dark:text-gray-300">Doing</h2>
                        <div class="kanban-tasks space-y-4 text-gray-700 dark:text-gray-300" id="doing-tasks"></div>
                    </div>
                    <div class="kanban-column bg-white dark:bg-gray-800 p-4 rounded">
                        <h2 class="text-lg mb-2 font-bold text-center text-gray-700 dark:text-gray-300">Done</h2>
                        <div class="kanban-tasks space-y-4 text-gray-700 dark:text-gray-300" id="done-tasks"></div>
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
    taskElement.classList.add('kanban-task', 'border-gray-300', 'p-2', 'rounded', 'mb-4', 'border', 'relative');

    taskElement.innerHTML = `
        <div class="task-header">
            <h4 class="text-center font-bold mb-2">${task.name}</h4>
            <p class="mb-1">Status: ${task.status}</p>
        </div>
        <div class="task-details">
            <p class="mb-1">Description: ${task.description}</p>
            <p class="mb-1">Priority: ${task.priority}</p>
        </div>
    `;
    return taskElement;
};

export default renderKanbanBoard;
