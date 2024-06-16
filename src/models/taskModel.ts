import { Priority, Status } from "./enums";
import User from "./User";

interface TaskModel {
    id: string;
    name: string;
    description: string;
    priority: Priority;
    storyId: string;
    estimatedTime: number;
    status: Status;
    addDate: Date;
    startDate?: Date;
    endDate?: Date;
    assignedUser?: User | null;
}

export default TaskModel