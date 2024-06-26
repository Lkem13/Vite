import { v4 as uuidv4 } from 'uuid';
import { Priority, Status } from '../models/enums';
import HistoryModel from '../models/historyModel';
import apiService from '../services/apiService';
import { renderHistoryList } from './HistoryList';
import axios from 'axios';

const addHistoryForm = (projectId: string) => {
    const addHistoryForm = document.createElement('form');
    addHistoryForm.innerHTML = `
    <label for="historyName">History Name:</label>
    <input type="text" id="historyName" name="historyName" required>

    <label for="historyDescription">History Description:</label>
    <textarea id="historyDescription" name="historyDescription" required></textarea>

    <label for="historyPriority">Priority:</label>
    <select id="historyPriority" name="historyPriority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>

    <label for="historyStatus">Status:</label>
    <select id="historyStatus" name="historyStatus">
      <option value="todo">Todo</option>
      <option value="doing">Doing</option>
      <option value="done">Done</option>
    </select>

    <button type="submit">Add History</button>
  `;

    addHistoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const historyNameInput = document.getElementById('historyName') as HTMLInputElement;
        const historyDescriptionInput = document.getElementById('historyDescription') as HTMLTextAreaElement;
        const historyPriorityInput = document.getElementById('historyPriority') as HTMLSelectElement;
        const historyStatusInput = document.getElementById('historyStatus') as HTMLSelectElement;

        const historyName = historyNameInput.value;
        const historyDescription = historyDescriptionInput.value;
        const historyPriority = historyPriorityInput.value as Priority;
        const historyStatus = historyStatusInput.value as Status;

        if (historyName && historyDescription) {
            const currentUser = apiService.getCurrentUser();
            if (currentUser) {
                const newHistory: HistoryModel = {
                    _id: uuidv4(),
                    name: historyName,
                    description: historyDescription,
                    priority: historyPriority,
                    project: projectId,
                    creationDate: new Date(),
                    status: historyStatus,
                    owner: currentUser.id,
                };
                try{
                  await axios.post(`http://localhost:3000/projects/${projectId}/histories`, newHistory);
                  await renderHistoryList(projectId);

                  addHistoryForm.reset();
                }catch(error){
                  console.error('Failed to add history:', error);
                }
                
            }
        }
    });

    return addHistoryForm;
};

export default addHistoryForm;
