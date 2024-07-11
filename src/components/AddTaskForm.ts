import { v4 as uuidv4 } from 'uuid';
import { Priority, Status } from "../models/enums";
import TaskModel from '../models/taskModel';
import { renderHistoryList } from "./HistoryList";
import axios from 'axios';

const addTaskForm = async (historyId: string, projectId: string): Promise<HTMLDivElement> => {
    const formContainer = document.createElement('div');
    formContainer.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-gray-800', 'bg-opacity-75');

    const addTaskForm = document.createElement('form');
    addTaskForm.classList.add('p-6', 'rounded', 'shadow-lg', 'max-w-md', 'w-full');
    addTaskForm.innerHTML = `
    <div class="bg-white dark:bg-gray-800 p-8 rounded-md shadow-lg max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Task</h2>
        <div class="mb-4">
            <label for="taskName" class="block text-gray-700 dark:text-gray-300">Task Name:</label>
            <input type="text" id="taskName" name="taskName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>

        <div class="mb-4">
            <label for="taskDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Description:</label>
            <textarea id="taskDescription" name="taskDescription" required rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>

        <div class="mb-4">
            <label for="taskPriority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</label>
            <select id="taskPriority" name="taskPriority" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>

        <div class="mb-4">
            <label for="taskEstimatedTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Time (hours):</label>
            <input type="number" id="taskEstimatedTime" name="taskEstimatedTime" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>

        <div class="mb-4">
            <label for="taskStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
            <select id="taskStatus" name="taskStatus" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="todo">Todo</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
            </select>
        </div>

        <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">Add Task</button>
            <button type="button" id="cancelButton" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
        </div>
        </div>
    `;

    addTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const taskNameInput = document.getElementById('taskName') as HTMLInputElement;
        const taskDescriptionInput = document.getElementById('taskDescription') as HTMLTextAreaElement;
        const taskPriorityInput = document.getElementById('taskPriority') as HTMLSelectElement;
        const taskEstimatedTimeInput = document.getElementById('taskEstimatedTime') as HTMLInputElement;
        const taskStatusInput = document.getElementById('taskStatus') as HTMLSelectElement;

        const taskName = taskNameInput.value;
        const taskDescription = taskDescriptionInput.value;
        const taskPriority = taskPriorityInput.value as Priority;
        const taskEstimatedTime = parseInt(taskEstimatedTimeInput.value, 10);
        const taskStatus = taskStatusInput.value as Status;

        if (taskName && taskDescription && taskEstimatedTime) {
            const newTask: TaskModel = {
                _id: uuidv4(),
                name: taskName,
                description: taskDescription,
                priority: taskPriority,
                historyId: historyId,
                estimatedTime: taskEstimatedTime,
                status: taskStatus,
                addDate: new Date(),
                startDate: taskStatus === 'doing' ? new Date() : undefined,
                endDate: taskStatus === 'done' ? new Date() : undefined,
            };

            try {
                await axios.post(`http://localhost:3000/histories/${historyId}/tasks`, newTask);
                await renderHistoryList(projectId);
                formContainer.remove();
            } catch (error) {
                console.error('Failed to add task:', error);
            }
        }
    });

    const cancelButton = addTaskForm.querySelector('#cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            formContainer.remove();
        });
    }

    formContainer.appendChild(addTaskForm);
    return formContainer;
};

export default addTaskForm;
