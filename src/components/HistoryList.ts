import { Priority, Status } from '../models/enums';
import HistoryModel from '../models/historyModel';
import apiService from '../services/apiService';
import addHistoryForm from './AddHistoryForm';
import addTaskForm from './AddTaskForm';
import renderKanbanBoard from './KanbanBoard';


const renderHistoryList = (projectId: string): void => {
    const appContainer = document.getElementById('app');

    if (appContainer) {
        const histories = apiService.getHistoriesByProjectId(projectId);
        appContainer.innerHTML = '';
        appContainer.appendChild(addHistoryForm(projectId));

        const kanbanContainer = document.createElement('div');
        kanbanContainer.classList.add('kanban-container');

        const todoHistories = histories.filter(history => history.status === Status.Todo);
        const doingHistories = histories.filter(history => history.status === Status.Doing);
        const doneHistories = histories.filter(history => history.status === Status.Done);

        renderHistories(todoHistories, "Todo");
        renderHistories(doingHistories, "Doing");
        renderHistories(doneHistories, "Done");
    }
};

const renderHistories = (histories: HistoryModel[], title: string, container?: HTMLElement): void => {
    const appContainer = container || document.getElementById('app');

    if (appContainer) {
        const historyList = document.createElement('ul');

        histories.forEach((history: HistoryModel) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Name: ${history.name} - Description: ${history.description} - Priority: ${history.priority} - Status: ${history.status}`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => handleEdit(history));

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => handleRemove(history.id, history.project));

            const kanbanButton = document.createElement('button');
            kanbanButton.textContent = 'Kanban';
            kanbanButton.addEventListener('click', () => renderKanbanBoard(history.id));

            const addTaskButton = document.createElement('button');
            addTaskButton.textContent = 'Add Task';
            addTaskButton.addEventListener('click', () => handleAddTask(history.id, history.project));

            const taskList = document.createElement('ul');
            const tasks = apiService.getTasksByHistoryId(history.id);
            tasks.forEach((task) => {
                const taskItem = document.createElement('li');
                taskItem.textContent = `Task: ${task.name} - Description: ${task.description} - Priority: ${task.priority} - Status: ${task.status}`;

                const detailsButton = document.createElement('button');
                detailsButton.textContent = 'Details';
                detailsButton.addEventListener('click', () => handleTaskDetails(task.id, history.project, history.id));

                taskItem.appendChild(detailsButton);
                taskList.appendChild(taskItem);
            });

            listItem.appendChild(editButton);
            listItem.appendChild(removeButton);
            listItem.appendChild(kanbanButton);
            listItem.appendChild(addTaskButton);
            listItem.appendChild(taskList);

            historyList.appendChild(listItem);
        });

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;

        appContainer.appendChild(titleElement);
        appContainer.appendChild(historyList);
    }
};

const handleEdit = (history: HistoryModel): void => {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('popup-container');

    const detailsContent = document.createElement('div');
    detailsContent.classList.add('popup-form');

    detailsContent.innerHTML = `
        <h2>Edit History</h2>
        <label for="editName">Name:</label>
        <input type="text" id="editName" value="${history.name}">
        <label for="editDescription">Description:</label>
        <textarea id="editDescription">${history.description}</textarea>
        <label for="editPriority">Priority:</label>
        <select id="editPriority">
            ${Object.values(Priority).map(priority => `<option value="${priority}" ${priority === history.priority ? 'selected' : ''}>${priority}</option>`).join('')}
        </select>
        <label for="editStatus">Status:</label>
        <select id="editStatus">
            ${Object.values(Status).map(status => `<option value="${status}" ${status === history.status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
        <button id="saveEditButton">Save</button>
        <button id="closeEditButton">Close</button>
    `;

    const closeButton = detailsContent.querySelector('#closeEditButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            detailsContainer.remove();
        });
    }

    const saveButton = detailsContent.querySelector('#saveEditButton');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
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

                apiService.editHistory(updatedHistory);
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

const handleRemove = (historyId: string, projectId: string): void => {
    const isConfirmed = confirm('Are you sure you want to remove this history?');

    if (isConfirmed) {
        apiService.deleteHistory(historyId);
        renderHistoryList(projectId);
    }
};

const handleAddTask = (historyId: string, projectId: string): void => {
    const appContainer = document.getElementById('app');
    if (appContainer) {
        const form = addTaskForm(historyId, projectId);
        appContainer.appendChild(form);
    }
}

const handleRemoveTask = (taskId: string, projectId: string): void => {
    const isConfirmed = confirm('Are you sure you want to remove this task?');

    if (isConfirmed) {
        apiService.deleteTask(taskId);
        renderHistoryList(projectId);
    }
};

const handleTaskDetails = (taskId: string, projectId: string, historyId: string): void => {
    const task = apiService.getTaskById(taskId);
    const project = apiService.getProjectById(projectId);
    const history = apiService.getHistoryById(historyId);

    if (history && task) {
        const assignedUser = task.assignedUser ? `${task.assignedUser.name} ${task.assignedUser.surname}` : 'Unassigned';

        const assignUserSection = !task.assignedUser
            ? `
                <label for="assignUser">Assign User:</label>
                <select id="assignUser">
                    <option value="">Select User</option>
                    ${apiService.getAllUsers().map(user => `<option value="${user.id}">${user.name} ${user.surname}</option>`).join('')}
                </select>
                <button id="assignUserButton">Assign User</button>
            `
            : '';

        const doneTaskButton= task.assignedUser && task.status != Status.Done
            ? `
                <button id="doneTaskButton">Done</button>
            `
            : '';

        const doneTaskSection = task.status == Status.Done
            ? `
                <p><strong>End Date:</strong> ${task.endDate?.toLocaleString()}</p>
            `
            : '';

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('popup-container');

        const detailsContent = document.createElement('div');
        detailsContent.classList.add('popup-form');

        detailsContent.innerHTML = `
            <h2>Task Details</h2>
            <p><strong>Name:</strong> ${task.name}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Project name:</strong> ${project ? project.name : 'Unknown Project'}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Status:</strong> ${task.status}</p>
            <p><strong>Start Date:</strong> ${task.startDate ? task.startDate.toLocaleString() : 'Not started'}</p>
            ${doneTaskSection}
            <p><strong>Estimated Time:</strong> ${task.estimatedTime} hours</p>
            <p><strong>Assigned User:</strong> ${assignedUser}</p>
            ${assignUserSection}
            ${doneTaskButton}
            <button id="deleteTaskButton">Delete</button>
            <button id="closeDetailsButton">Close</button>
        `;

        const closeButton = detailsContent.querySelector('#closeDetailsButton');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                detailsContainer.remove();
                renderHistoryList(projectId);
            });
        }

        const deleteTaskButton = detailsContent.querySelector('#deleteTaskButton');
        if (deleteTaskButton) {
            deleteTaskButton.addEventListener('click', () => {
                handleRemoveTask(task.id, history.project);
                detailsContainer.remove();
            })
        }

        if (!task.assignedUser){
            const assignButton = detailsContent.querySelector('#assignUserButton');
            if (assignButton) {
                assignButton.addEventListener('click', () => {
                    const userId = (detailsContent.querySelector('#assignUser') as HTMLSelectElement).value;
                    if (userId) {
                        handleAssignUserToTask(task.id, userId, projectId, history.id);
                        detailsContainer.remove();
                    } else {
                        alert('Please select a user to assign.');
                    }
                });
            }
        }

        if (task.assignedUser) {
            const doneButton = detailsContent.querySelector('#doneTaskButton');
            if (doneButton) {
                doneButton.addEventListener('click', () => {
                    handleDoneTask(task.id, projectId);
                    detailsContainer.remove();
                })
            }
        }

        detailsContainer.appendChild(detailsContent);
        document.body.appendChild(detailsContainer);
    } else {
        console.error('Task not found');
    }
};

const handleAssignUserToTask = (taskId: string, userId: string, projectId: string, historyId: string): void => {
    const task = apiService.getTaskById(taskId);
    const history = apiService.getHistoryById(historyId)
    if (history && task) {
        const user = apiService.getUserById(userId);
        if (user) {
            task.assignedUser = user;
            task.status = Status.Doing;
            task.startDate = new Date();
            history.status = Status.Doing;
            apiService.updateTask(task);
            apiService.editHistory(history);
            renderHistoryList(projectId);
        } else {
            alert('User not found');
        }
    } else {
        alert('Task not found');
    }
};

const handleDoneTask = (taskId: string, projectId: string): void => {
    const task = apiService.getTaskById(taskId);
    if (task) {
        task.status = Status.Done;
        task.endDate = new Date();
        apiService.updateTask(task);
        renderHistoryList(projectId);
    } else {
        alert('Task not found');
    }
}

export { renderHistoryList, renderHistories };
