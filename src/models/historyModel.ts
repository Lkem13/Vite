import { Priority, Status } from "./enums";


interface HistoryModel {
    id: string;
    name: string;
    description: string;
    priority: Priority;
    project: string;
    creationDate: Date;
    status: Status;
    owner: string;
}

export default HistoryModel