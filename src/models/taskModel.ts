import { Priority, Status } from "./enums";
import User from "./User";

interface TaskModel {
    _id: string;
    name: string;
    description: string;
    priority: Priority;
    historyId: string;
    estimatedTime: number;
    status: Status;
    addDate: Date;
    startDate?: Date;
    endDate?: Date;
    assignedUser?: User | null;
}

export default TaskModel