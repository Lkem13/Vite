import { v4 as uuidv4 } from 'uuid';
import { Priority, Status } from '../models/enums';
import HistoryModel from '../models/historyModel';
import apiService from '../services/apiService';
import { renderHistoryList } from './HistoryList';
import axios from 'axios';

const addHistoryForm = async (projectId: string): Promise<HTMLDivElement> => {
    const addHistoryForm = document.createElement('div');
    addHistoryForm.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');
    addHistoryForm.innerHTML = `
    <div class="bg-white dark:bg-gray-800 p-8 rounded-md shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add History</h2>
      <form id="addHistoryForm" class="space-y-4">
        <label for="historyName" class="block text-gray-700 dark:text-gray-300">History Name:</label>
        <input type="text" id="historyName" name="historyName" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>

        <label for="historyDescription" class="block text-gray-700 dark:text-gray-300">History Description:</label>
        <textarea id="historyDescription" name="historyDescription" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-32 resize-none" required></textarea>

        <label for="historyPriority" class="block text-gray-700 dark:text-gray-300">Priority:</label>
        <select id="historyPriority" name="historyPriority" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label for="historyStatus" class="block text-gray-700 dark:text-gray-300">Status:</label>
        <select id="historyStatus" name="historyStatus" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <div class="flex justify-end space-x-2">
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">Add History</button>
          <button id="closeHistoryButton" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Close</button>
        </div>
      </form>
    </div>
  `;

    const closeButton = addHistoryForm.querySelector('#closeHistoryButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            addHistoryForm.remove();
        });
    }

    const addHistoryFormSubmit = addHistoryForm.querySelector('#addHistoryForm');
    if (addHistoryFormSubmit) {
        addHistoryFormSubmit.addEventListener('submit', async (event) => {
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
                    try {
                        await axios.post(`http://localhost:3000/projects/${projectId}/histories`, newHistory);
                        await renderHistoryList(projectId);

                        addHistoryForm.remove();
                    } catch (error) {
                        console.error('Failed to add history:', error);
                    }
                }
            }
        });
    }

    return addHistoryForm;
};

export default addHistoryForm;