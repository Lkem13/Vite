import { HistoryModel, Priority, Status } from '../models/historyModel';
import apiService from '../services/apiService';
import addHistoryForm from './AddHistoryForm';


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
            removeButton.addEventListener('click', () => handleRemove(history.id));

            listItem.appendChild(editButton);
            listItem.appendChild(removeButton);

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

const handleRemove = (historyId: string): void => {
    const isConfirmed = confirm('Are you sure you want to remove this history?');

    if (isConfirmed) {
        apiService.deleteHistory(historyId);
        //renderHistoryList(projectId);
    }
};

export { renderHistoryList };
