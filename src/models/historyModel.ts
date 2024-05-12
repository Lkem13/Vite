enum Priority {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

enum Status {
    Todo = 'todo',
    Doing = 'doing',
    Done = 'done',
}

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

export type { HistoryModel }
export {Priority, Status };