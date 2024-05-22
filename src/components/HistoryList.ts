import { Priority, Status } from '../models/enums';
import HistoryModel from '../models/historyModel';
import apiService from '../services/apiService';
import addHistoryForm from './AddHistoryForm';
import addTaskForm from './AddTaskForm';


const renderHistoryList = (projectId: string): void => {
    const appContainer = document.getElementById('app');

    if (appContainer) {
        const histories = apiService.getHistoriesByProjectId(projectId);
        appContainer.innerHTML = '';
        appContainer.appendChild(addHistoryForm(projectId));

        const todoHistories = histories.filter(history => history.status === Status.Todo);
        const doingHistories = histories.filter(history => history.status === Status.Doing);
        const doneHistories = histories.filter(history => history.status === Status.Done);

        renderHistories(todoHistories, "Todo");
        renderHistories(doingHistories, "Doing");
        renderHistories(doneHistories, "Done");

        
    }
};

const renderHistories = (histories: HistoryModel[], title: string): void => {
    const appContainer = document.getElementById('app');

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
                detailsButton.addEventListener('click', () => handleTaskDetails(task.name, history.project));

                taskItem.appendChild(detailsButton);
                taskList.appendChild(taskItem);
            });

            listItem.appendChild(editButton);
            listItem.appendChild(removeButton);
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
    const newName = prompt('Enter new history name:', history.name);
    const newDescription = prompt('Enter new history description:', history.description);
    const newPriority = prompt('Enter new history priority:', history.priority);
    const newStatus = prompt('Enter new history status:', history.status);

    if (newName !== null && newName.trim() !== '' && newDescription !== null && newDescription.trim() !== '') {
        const updatedHistory: HistoryModel = {
            ...history,
            name: newName,
            description: newDescription,
            priority: newPriority as Priority|| history.priority,
            status: newStatus as Status|| history.status,
        };

        apiService.editHistory(updatedHistory);
        renderHistoryList(updatedHistory.project);
    } else {
        alert('Invalid input. Please provide non-empty values for name and description.');
    }
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

const handleTaskDetails = (taskName: string, projectId: string): void => {
    const task = apiService.getTaskByName(taskName);
    const project = apiService.getProjectById(projectId);

    if (task) {
        const assignedUser = task.assignedUser ? `${task.assignedUser.name} ${task.assignedUser.surname}` : 'Unassigned';
        const startDateString = task.startDate ? task.startDate.toLocaleDateString() : 'Not started';


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
            <p><strong>Start Date:</strong> ${startDateString}</p>
            <p><strong>Estimated Time:</strong> ${task.estimatedTime} hours</p>
            <p><strong>Assigned User:</strong> ${assignedUser}</p>
            <button id="closeDetailsButton">Close</button>
        `;

        const closeButton = detailsContent.querySelector('#closeDetailsButton');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                detailsContainer.remove();
            });
        }

        detailsContainer.appendChild(detailsContent);

        document.body.appendChild(detailsContainer);
    } else {
        console.error('Task not found');
    }
};

export { renderHistoryList };
