import axios from 'axios';
import { Priority, Status } from '../models/enums';
import HistoryModel from '../models/historyModel';
import apiService from '../services/apiService';
import addHistoryForm from './AddHistoryForm';
import addTaskForm from './AddTaskForm';
import renderKanbanBoard from './KanbanBoard';
import { renderProjects } from './ProjectList';



const renderHistoryList = async (projectId: string): Promise<void> => {
    const appContainer = document.getElementById('app');

    if (appContainer) {
        const historiesResponse = await axios.get<HistoryModel[]>(`http://localhost:3000/projects/${projectId}/histories`);
        const histories = historiesResponse.data;

        appContainer.innerHTML = '';

        const addHistoryButton = document.createElement('button');
        addHistoryButton.textContent = 'Add History';
        addHistoryButton.className = 'mb-4 mx-auto block mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 center';
        addHistoryButton.addEventListener('click', () => handleAddHistory(projectId));
        appContainer.appendChild(addHistoryButton);

        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Projects List';
        backButton.className = 'mb-4 mx-auto block mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700';
        backButton.addEventListener('click', () => {
            apiService.setCurrentProject(null);
            renderProjects();   
        });
        appContainer.appendChild(backButton);

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid', 'grid-cols-3', 'gap-4');

        const todoHistories = histories.filter((history: HistoryModel) => history.status === Status.Todo);
        const doingHistories = histories.filter((history: HistoryModel) => history.status === Status.Doing);
        const doneHistories = histories.filter((history: HistoryModel) => history.status === Status.Done);

        await Promise.all([
            renderHistories(todoHistories, "Todo", gridContainer, 1),
            renderHistories(doingHistories, "Doing", gridContainer, 2),
            renderHistories(doneHistories, "Done", gridContainer, 3)
        ]);

        appContainer.appendChild(gridContainer);
    }
};

const renderHistories = async (histories: HistoryModel[], title: string, container: HTMLElement, columnIndex: number): Promise<void> => {
    const historyList = document.createElement('ul');
    historyList.classList.add('bg-white', 'dark:bg-gray-800', 'p-4', 'rounded', 'mx-auto', 'mt-4');
    historyList.style.maxWidth = '600px';

    for (const history of histories) {
        const listItem = document.createElement('li');
        listItem.classList.add('mb-4', 'p-2', 'border', 'border-gray-300', 'rounded', 'relative', 'text-gray-900', 'dark:text-gray-200');

        const nameElement = document.createElement('h3');
        nameElement.classList.add('text-center', 'font-bold', 'mb-2');
        nameElement.textContent = history.name;
        listItem.appendChild(nameElement);

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('mb-2');
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = `Description: ${history.description}`;
        const priorityElement = document.createElement('p');
        priorityElement.textContent = `Priority: ${history.priority}`;
        const statusElement = document.createElement('p');
        statusElement.textContent = `Status: ${history.status}`;
        detailsContainer.appendChild(descriptionElement);
        detailsContainer.appendChild(priorityElement);
        detailsContainer.appendChild(statusElement);
        listItem.appendChild(detailsContainer);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('absolute', 'top-2', 'right-2', 'flex', 'space-x-2');

        const addTaskButton = document.createElement('button');
        addTaskButton.className = 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600';
        const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>`;
            addTaskButton.innerHTML = addIcon;
        addTaskButton.addEventListener('click', () => handleAddTask(history._id, history.project));
        buttonsContainer.appendChild(addTaskButton);

        const editButton = document.createElement('button');
        editButton.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
        const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>`;
            editButton.innerHTML = editIcon;
        editButton.addEventListener('click', () => handleEdit(history));
        buttonsContainer.appendChild(editButton);

        const removeButton = document.createElement('button');
        removeButton.className = 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600';
        const removeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>`;
            removeButton.innerHTML = removeIcon;
        removeButton.addEventListener('click', () => handleRemove(history._id, history.project));
        buttonsContainer.appendChild(removeButton);

        listItem.appendChild(buttonsContainer);

        const kanbanButton = document.createElement('button');
        kanbanButton.className = 'px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 absolute bottom-2 right-2';
        const kanbanIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
            </svg>`;
            kanbanButton.innerHTML = kanbanIcon;
        kanbanButton.addEventListener('click', () => renderKanbanBoard(history._id));
        listItem.appendChild(kanbanButton);

        const taskList = document.createElement('ul');
        taskList.classList.add('mt-2');

        listItem.appendChild(taskList);
        
        try {
            const tasksResponse = await axios.get(`http://localhost:3000/histories/${history._id}/tasks`);
            const tasks = tasksResponse.data;

            tasks.forEach((task: any) => {
                const taskItem = document.createElement('li');
                taskItem.textContent = `Task: ${task.name} - Priority: ${task.priority} - Status: ${task.status}`;

                const detailsButton = createButton('i', () => handleTaskDetails(task._id, history.project, history._id));
                taskItem.appendChild(detailsButton);
                taskList.appendChild(taskItem);
            });
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }

        historyList.appendChild(listItem);
    }

    const titleElement = document.createElement('h2');
    titleElement.classList.add('text-lg', 'font-bold', 'mb-2', 'text-center', 'dark:text-white');
    titleElement.textContent = title;

    const columnWrapper = document.createElement('div');
    columnWrapper.classList.add('col-span-1');
    columnWrapper.style.gridArea = `1 / ${columnIndex}`;

    columnWrapper.appendChild(titleElement);
    columnWrapper.appendChild(historyList);

    container.appendChild(columnWrapper);
};

const createButton = (text: string, onClick: () => void): HTMLButtonElement => {
    const button = document.createElement('button');
    button.classList.add('bg-blue-500', 'text-white', 'py-1', 'px-3', 'rounded-full', 'mr-2');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
};

const handleAddHistory = async (projectId: string): Promise<void> => {
    const appContainer = document.getElementById('app');
    if(appContainer){
        const form = await addHistoryForm(projectId);
        appContainer.appendChild(form);
    }
}


const handleEdit = (history: HistoryModel): void => {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('fixed', 'inset-0', 'bg-gray-800', 'bg-opacity-75', 'flex', 'items-center', 'justify-center', 'z-50');

    const detailsContent = document.createElement('div');
    detailsContent.classList.add('bg-white', 'dark:bg-gray-800', 'rounded', 'shadow-lg', 'p-6', 'w-full', 'max-w-lg');

    detailsContent.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Edit History</h2>
        <label for="editName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name:</label>
        <input type="text" id="editName" value="${history.name}" class="border border-gray-300 rounded p-1 mb-4 w-full">
        <label for="editDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
        <textarea id="editDescription" class="border border-gray-300 dark:border-gray-600 rounded p-1 mb-4 w-full">${history.description}</textarea>
        <label for="editPriority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</label>
        <select id="editPriority" class="border border-gray-300 rounded p-1 mb-4 w-full">
            ${Object.values(Priority).map(priority => `<option value="${priority}" ${priority === history.priority ? 'selected' : ''}>${priority}</option>`).join('')}
        </select>
        <label for="editStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
        <select id="editStatus" class="border border-gray-300 rounded p-1 mb-4 w-full">
            ${Object.values(Status).map(status => `<option value="${status}" ${status === history.status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
        <div class="flex justify-end">
            <button id="saveEditButton" class="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600">Save</button>
            <button id="closeEditButton" class="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">Close</button>
        </div>
    `;

    const closeButton = detailsContent.querySelector('#closeEditButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            detailsContainer.remove();
        });
    }

    const saveButton = detailsContent.querySelector('#saveEditButton');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            const newName = (detailsContent.querySelector('#editName') as HTMLInputElement).value.trim();
            const newDescription = (detailsContent.querySelector('#editDescription') as HTMLTextAreaElement).value.trim();
            const newPriority = (detailsContent.querySelector('#editPriority') as HTMLSelectElement).value as Priority;
            const newStatus = (detailsContent.querySelector('#editStatus') as HTMLSelectElement).value as Status;

            if (newName && newDescription) {
                const updatedHistory: HistoryModel = {
                    ...history,
                    name: newName,
                    description: newDescription,
                    priority: newPriority,
                    status: newStatus,
                };

                await axios.put(`http://localhost:3000/histories/${history._id}`, updatedHistory);
                renderHistoryList(updatedHistory.project);
                detailsContainer.remove();
            } else {
                alert('Invalid input. Please provide non-empty values for name and description.');
            }
        });
    }

    detailsContainer.appendChild(detailsContent);
    document.body.appendChild(detailsContainer);
};

const handleRemove = async (historyId: string, projectId: string): Promise<void> => {
    const isConfirmed = confirm('Are you sure you want to remove this history?');

    if (isConfirmed) {
        try {
            await axios.delete(`http://localhost:3000/histories/${historyId}`);
            renderHistoryList(projectId);
        } catch (error) {
            console.error('Failed to remove history:', error);
            alert('Failed to remove history. Please try again later.');
        }
    }
};

const handleAddTask = async (historyId: string, projectId: string): Promise<void> => {
    const appContainer = document.getElementById('app');
    if (appContainer) {
        const form = await addTaskForm(historyId, projectId);
        appContainer.appendChild(form);
    }
}

const handleRemoveTask = async (taskId: string, projectId: string): Promise<void> => {
    const isConfirmed = confirm('Are you sure you want to remove this task?');

    if (isConfirmed) {
        try{
            await axios.delete(`http://localhost:3000/tasks/${taskId}`);
            renderHistoryList(projectId);
            console.log(taskId);
        }catch(error){
            console.error('Failed to remove task:', error);
        }
    }
};

const handleTaskDetails = async (taskId: string, projectId: string, historyId: string): Promise<void> => {
    const [tasksResponse, projectsResponse, historiesResponse] = await Promise.all([
        axios.get(`http://localhost:3000/tasks/${taskId}`),
        axios.get(`http://localhost:3000/projects/${projectId}`),
        axios.get(`http://localhost:3000/histories/${historyId}`)
    ]);

    const task = tasksResponse.data;
    const project = projectsResponse.data;
    const history = historiesResponse.data;

    if (history && task) {
        const assignedUser = task.assignedUser ? `${task.assignedUser.name} ${task.assignedUser.surname}` : 'Unassigned';

        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(2);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        };

        const assignUserSection = !task.assignedUser
    ? `
        <div id="assignSection" class="my-2">
            <label for="assignUser" class="block text-sm font-medium text-gray-700">Assign User:</label>
            <select id="assignUser" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="">Select User</option>
                ${apiService.getAllUsers().map(user => `<option value="${user.id}">${user.name} ${user.surname}</option>`).join('')}
            </select>
            <button id="assignUserButton" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Assign User</button>
        </div>
    `
    : '';

        const doneTaskButton = task.assignedUser && task.status !== 'done'
            ? `
                <button id="doneTaskButton" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Done</button>
            `
            : '';

        const doneTaskSection = task.status === 'done'
            ? `
                <p class="my-2"><strong>End Date:</strong> ${task.endDate ? formatDate(task.endDate) : 'Not specified'}</p>
            `
            : '';

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-gray-800', 'bg-opacity-75');

        const detailsContent = document.createElement('div');
        detailsContent.classList.add('bg-white', 'p-6', 'rounded', 'shadow-lg', 'max-w-md', 'w-full');

        detailsContent.innerHTML = `
            <h2 class="text-xl font-bold mb-4">Task Details</h2>
            <p class="my-2"><strong>Name:</strong> <span id="taskName">${task.name}</span></p>
            <p class="my-2"><strong>Description:</strong> <span id="taskDescription">${task.description}</span></p>
            <p class="my-2"><strong>Project name:</strong> ${project ? project.name : 'Unknown Project'}</p>
            <p class="my-2"><strong>Priority:</strong> <span id="taskPriority">${task.priority}</span></p>
            <p class="my-2"><strong>Status:</strong> <span id="taskStatus">${task.status}</span></p>
            <p class="my-2"><strong>Start Date:</strong> <span id="taskStartDate">${task.startDate ? formatDate(task.startDate) : 'Not started'}</span></p>
            ${doneTaskSection}
            <p class="my-2"><strong>Estimated Time:</strong> <span id="taskEstimatedTime">${task.estimatedTime} hours</span></p>
            <p class="my-2"><strong>Assigned User:</strong> <span id="assignedUser">${assignedUser}</span></p>
            ${assignUserSection}
            ${doneTaskButton}
            <button id="editTaskButton" class="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
            <button id="deleteTaskButton" class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            <button id="closeDetailsButton" class="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Close</button>
        `;

        const closeButton = detailsContent.querySelector('#closeDetailsButton');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                detailsContainer.remove();
            });
        }

        const deleteTaskButton = detailsContent.querySelector('#deleteTaskButton');
        if (deleteTaskButton) {
            deleteTaskButton.addEventListener('click', () => {
                handleRemoveTask(task._id, history.project);
                detailsContainer.remove();
            });
        }

        if(task.assignedUser){
            const doneButton = detailsContent.querySelector('#doneTaskButton');
            if(doneButton){
                doneButton.addEventListener('click', async () => {
                    handleDoneTask(task._id, projectId);
                        detailsContainer.remove();
            });
        }};
        

        if (!task.assignedUser) {
            const assignButton = detailsContent.querySelector('#assignUserButton');
            if (assignButton) {
                assignButton.addEventListener('click', () => {
                    const userId = (detailsContent.querySelector('#assignUser') as HTMLSelectElement).value;
                    if (userId) {
                        handleAssignUserToTask(task._id, userId, projectId, history._id);
                        detailsContainer.remove();
                    } else {
                        alert('Please select a user to assign.');
                    }
                });
            }
        }

        const editTaskButton = detailsContent.querySelector('#editTaskButton');
if (editTaskButton) {
    editTaskButton.addEventListener('click', () => {
        const toggleEditMode = () => {
            const editableFields = [
                { id: 'taskName', value: task.name, type: 'text' },
                { id: 'taskDescription', value: task.description, type: 'text' },
                { id: 'taskEstimatedTime', value: `${task.estimatedTime}`, type: 'number' },
                { id: 'assignedUser', value: task.assignedUser ? task.assignedUser._id : '', type: 'select' }
            ];

            const doneButton = detailsContent.querySelector('#doneTaskButton');
            doneButton?.remove();
            const assignUserSection = detailsContent.querySelector('#assignSection');
            assignUserSection?.remove();

            editableFields.forEach(field => {
                const element = detailsContent.querySelector(`#${field.id}`);
                if (element) {
                    if (field.type === 'select') {
                        const select = document.createElement('select');
                        select.className = 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md';

                        const usersOptions = apiService.getAllUsers().map(user => `
                            <option value="${user.id}" ${task.assignedUser && task.assignedUser._id === user.id ? 'selected' : ''}>${user.name} ${user.surname}</option>
                        `).join('');

                        select.innerHTML = `
                            <option value="">Select User</option>
                            ${usersOptions}
                        `;
                        element.replaceWith(select);
                        select.id = field.id;
                    } else {
                        const input = document.createElement('input');
                        input.type = field.type;
                        input.value = field.value;
                        input.className = 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md';
                        element.replaceWith(input);
                        input.id = field.id;
                    }
                }
            });

            const priorityElement = detailsContent.querySelector('#taskPriority');
            if (priorityElement) {
                const select = document.createElement('select');
                select.className = 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md';
                select.innerHTML = Object.values(Priority).map(value => `
                    <option value="${value}" ${task.priority === value ? 'selected' : ''}>${value.charAt(0).toUpperCase() + value.slice(1)}</option>
                `).join('');
                priorityElement.replaceWith(select);
                select.id = 'taskPriority';
            }

            const statusElement = detailsContent.querySelector('#taskStatus');
            if (statusElement) {
                const select = document.createElement('select');
                select.className = 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md';
                select.innerHTML = Object.values(Status).map(value => `
                    <option value="${value}" ${task.status === value ? 'selected' : ''}>${value.charAt(0).toUpperCase() + value.slice(1)}</option>
                `).join('');
                statusElement.replaceWith(select);
                select.id = 'taskStatus';
            }

            editTaskButton.textContent = 'Save';
            editTaskButton.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
            editTaskButton.classList.add('bg-green-500', 'hover:bg-green-600');
        };

        const saveChanges = async () => {
            const newName = (detailsContent.querySelector('#taskName') as HTMLInputElement).value.trim();
            const newDescription = (detailsContent.querySelector('#taskDescription') as HTMLInputElement).value.trim();
            const newEstimatedTime = parseFloat((detailsContent.querySelector('#taskEstimatedTime') as HTMLInputElement).value);
            const newPriority = (detailsContent.querySelector('#taskPriority') as HTMLSelectElement).value as Priority;
            const newStatus = (detailsContent.querySelector('#taskStatus') as HTMLSelectElement).value as Status;
            const newAssignedUserId = (detailsContent.querySelector('#assignedUser') as HTMLSelectElement).value;

            const updatedTask = {
                ...task,
                name: newName,
                description: newDescription,
                estimatedTime: newEstimatedTime,
                priority: newPriority,
                status: newStatus,
                assignedUser: newAssignedUserId 
            };

            try {
                await axios.put(`http://localhost:3000/tasks/${taskId}`, updatedTask);
                handleAssignUserToTask(taskId, newAssignedUserId, projectId, historyId);
                console.log(newAssignedUserId);
                detailsContainer.remove();
            } catch (error) {
                console.error('Failed to update task', error);
                alert('Failed to update task. Please try again.');
            }
        };

        if (editTaskButton.textContent === 'Edit') {
            toggleEditMode();
        } else {
            saveChanges();
        }
    });
}

        detailsContainer.appendChild(detailsContent);
        document.body.appendChild(detailsContainer);
    } else {
        console.error(`Task not found ${taskId}, ${historyId}`);
    }
};
const handleAssignUserToTask = async (taskId: string, userId: string, projectId: string, historyId: string): Promise<void> => {
    const historiesResponse = await axios.get(`http://localhost:3000/histories/${historyId}`);
    const history = historiesResponse.data;
    const tasksResponse = await axios.get(`http://localhost:3000/tasks/${taskId}`);
    const task = tasksResponse.data;
    if (history && task) {
        const user = apiService.getUserById(userId);
        if (user) {
            task.assignedUser = user;
            task.status = Status.Doing;
            task.startDate = new Date();
            history.status = Status.Doing;
            await axios.put(`http://localhost:3000/tasks/${taskId}`, task);
            await axios.put(`http://localhost:3000/histories/${historyId}`, history);
            renderHistoryList(projectId);
        } else {
            alert('User not found');
        }
    } else {
        alert('Task not found');
    }
};

const handleDoneTask = async (taskId: string, projectId: string): Promise<void> => {
    const tasksResponse = await axios.get(`http://localhost:3000/tasks/${taskId}`);
    const task = tasksResponse.data;
    if (task) {
        task.status = Status.Done;
        task.endDate = new Date();
        await axios.put(`http://localhost:3000/tasks/${taskId}`, task);
        renderHistoryList(projectId);
    } else {
        alert('Task not found');
    }
}

export { renderHistoryList, renderHistories };
