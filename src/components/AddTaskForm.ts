import { v4 as uuidv4 } from 'uuid';
import { Priority, Status } from "../models/enums";
import TaskModel from '../models/taskModel';
import { renderHistoryList } from "./HistoryList";
import axios from 'axios';

const addTaskForm = (historyId: string, projectId: string) => {
    const formContainer = document.createElement('div');
    formContainer.classList.add('popup-container');

    const addTaskForm = document.createElement('form');
    addTaskForm.classList.add('popup-form');
    addTaskForm.innerHTML = `
        <label for="taskName">Task Name:</label>
        <input type="text" id="taskName" name="taskName" required>

        <label for="taskDescription">Task Description:</label>
        <textarea id="taskDescription" name="taskDescription" required></textarea>

        <label for="taskPriority">Priority:</label>
        <select id="taskPriority" name="taskPriority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label for="taskEstimatedTime">Estimated Time (hours):</label>
        <input type="number" id="taskEstimatedTime" name="taskEstimatedTime" required>

        <label for="taskStatus">Status:</label>
        <select id="taskStatus" name="taskStatus">
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <button type="submit">Add Task</button>
        <button type="button" id="cancelButton">Cancel</button>
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

            try{
                await axios.post(`http://localhost:3000/histories/${historyId}/tasks`, newTask);
                await renderHistoryList(projectId);
                formContainer.remove();
            }catch(error){
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
