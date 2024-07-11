import * as jwt from 'jsonwebtoken';
import express, { Express, Request, Response } from "express";
import * as dotenv from 'dotenv';
import { connectToDb, getDb } from './mongodb';
import ProjectModel from '../../models/projectModel';
import HistoryModel from '../../models/historyModel';
import TaskModel from '../../models/taskModel';

dotenv.config();

const cors = require('cors');

const app: Express = express()

const port = process.env.PORT || 3000;

const tokenSecret = process.env.TOKEN_SECRET as string
console.log('Token Secret:', tokenSecret);
let refreshToken: string
let currentProject: ProjectModel | null = null;
app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World - simple api with JWT!')
})

app.post(
    "/token",
    function (req, res) {
        const expTime = req.body.exp || 60
        const token = generateToken(+expTime)
        refreshToken = generateToken(60 * 60)
        res.status(200).send({ token, refreshToken })
    }
)
app.post(
    "/refreshToken",
    function (req, res) {
        const refreshTokenFromPost = req.body.refreshToken
        if (refreshToken !== refreshTokenFromPost) {
            res.status(400).send('Bad refresh token!')
        }
        const expTime = req.headers.exp || 60
        const token = generateToken(+expTime)
        refreshToken = generateToken(60 * 60)
        setTimeout(() => {
            res.status(200).send({ token, refreshToken })
        }, 3000)
    }
)
app.get(
    "/protected/:id/:delay?",
    verifyToken,
    (req, res) => {
        const id = req.params.id
        const delay = req.params.delay ? +req.params.delay : 1000
        setTimeout(() => {
            res.status(200).send(`{"message": "protected endpoint ${id}"}`)
        }, delay)
    }
)
app.listen(port, async () => {
    try{
        await connectToDb();
        console.log(`Example app listening on port ${port}`)
    } catch (error){
        console.error('Error:', error);
        process.exit(1);
    }
    
})

function generateToken(expirationInSeconds: number) {
    const exp = Math.floor(Date.now() / 1000) + expirationInSeconds
    const token = jwt.sign({ exp, foo: 'bar' }, tokenSecret, { algorithm: 'HS256' })
    return token
}

function verifyToken(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) return res.sendStatus(403)

    jwt.verify(token, tokenSecret, (err: any, user: any) => {
        if (err) {
            console.log(err)
            return res.status(401).send(err.message)
        }
        req.user = user
        next()
    })
}

app.get('/projects', async (req, res) => {
    try{
        const db = getDb();
        const projects = await db.collection('projects').find().toArray();
        res.send(projects).status(200);
    } catch(error){
        console.error('Error fetching projects:', error);
        res.sendStatus(500);
    }
});

app.get('/users', async (req, res) => {
    try{
        const db = getDb();
        const users = await db.collection('users').find().toArray();
        res.send(users).status(200);
    } catch(error){
        console.error('Error fetching users:', error);
        res.sendStatus(500);
    }
});

app.get('/projects/:id', async (req, res) => {
    try{
        const db = getDb();
        const project = await db.collection('projects').findOne(req.body);
        if(project){
            res.send(project);
        }else{
            console.error('Project not found');
            res.sendStatus(404);
        }
    } catch(error){
        console.error('Error fetching project:', error);
        res.sendStatus(500);
    }
});

app.get('/projects/:project/histories', async (req, res) => {
    try {
        const db = getDb();
        const histories = await db.collection('histories').find({ project: req.params.project }).toArray();
        res.status(200).send(histories);
    } catch (error) {
        console.error('Error fetching histories:', error);
        res.sendStatus(500);
    }
});

app.get('/histories', async (req, res) => {
    try{
        const db = getDb();
        const histories = await db.collection('histories').find().toArray();
        res.send(histories).status(200);
    } catch(error){
        console.error('Error fetching histories::', error);
        res.sendStatus(500);
    }
});

app.get('/histories/:id', async (req, res) => {
    try {
        const db = getDb();
        const history = await db.collection('histories').findOne({ _id: req.params.id });
        
        if (history) {
            res.status(200).send(history);
        } else {
            console.error('History not found');
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error fetching history:', error);
        res.sendStatus(500);
    }
});

app.get('/histories/:id/tasks', async (req, res) => {
    try {
        const db = getDb();
        const tasks = await db.collection('tasks').find({ historyId: req.params.id }).toArray();
        res.status(200).send(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.sendStatus(500);
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const db = getDb();
        const task = await db.collection('tasks').findOne({ _id: req.params.id });
        
        if (task) {
            res.status(200).send(task);
        } else {
            console.error('Task not found');
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        res.sendStatus(500);
    }
});

app.get('/projects/:projectId/allTasks', async (req, res) => {
    try {
        const db = getDb();
        const histories = await db.collection('histories').find({ project: req.params.projectId }).toArray();
        const historyIds = histories.map((history: { _id: string }) => history._id);
        const tasks = await db.collection('tasks').find({ historyId: { $in: historyIds } }).toArray();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.post('/projects', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const newProject: ProjectModel = req.body;
        const result = await db.collection('projects').insertOne(newProject);
        res.send(result).status(201);
        console.log('Project created:', result);
    } catch (error) {
        console.error('Failed to create project', error);
        res.sendStatus(500);
    }
});

app.post('/projects/:projectId/histories', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const newHistory: HistoryModel = req.body;
        newHistory.project = req.params.projectId;
        newHistory.creationDate = new Date();
        const result = await db.collection('histories').insertOne(newHistory);
        res.send(result).status(201);
        console.log('History created:', result);
    } catch (error) {
        console.error('Failed to create history', error);
        res.sendStatus(500);
    }
});

app.post('/histories/:historyId/tasks', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const newTask: TaskModel = req.body;
        newTask.historyId = req.params.historyId;
        newTask.addDate = new Date();
        const result = await db.collection('tasks').insertOne(newTask);
        res.send(result).status(201);
        console.log('Task created:', result);
    } catch (error) {
        console.error('Failed to create task', error);
        res.sendStatus(500);
    }
});

app.put('/projects/:id', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const updatedProject: ProjectModel = req.body;
        const result = await db.collection('projects').findOneAndUpdate(
            { _id: req.params.id },
            { $set: updatedProject },
            {returnOriginal: false}
        );
            res.send(result.value);
        } catch (error) {
        console.error('Failed to update project', error);
        res.sendStatus(500);
    }
});

app.put('/histories/:id', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const updatedHistory: HistoryModel = req.body;
        const result = await db.collection('histories').findOneAndUpdate(
            { _id: req.params.id },
            { $set: updatedHistory },
            { returnOriginal: false }
        );
        res.send(result.value);
    } catch (error) {
        console.error('Failed to update history', error);
        res.sendStatus(500);
    }
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const updatedTask: TaskModel = req.body;
        const result = await db.collection('tasks').findOneAndUpdate(
            { _id: req.params.id },
            { $set: updatedTask },
            { returnOriginal: false }
        );
        res.send(result.value);
    } catch (error) {
        console.error('Failed to update task', error);
        res.sendStatus(500);
    }
});

app.delete('/projects/:id', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        await db.collection('projects').deleteOne({ _id: req.params.id});
        res.sendStatus(200);
    } catch (error) {
        console.error('Failed to delete project', error);
        res.sendStatus(500);
    }
});

app.delete('/histories/:id', async (req: Request, res: Response) => {
    try {
        const db = getDb();
         await db.collection('histories').deleteOne({ _id: req.params.id });
        res.sendStatus(200);
    } catch (error) {
        console.error('Failed to delete history', error);
        res.sendStatus(500);
    }
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        await db.collection('tasks').deleteOne({ _id: req.params.id});
        res.sendStatus(200);
    } catch (error) {
        console.error('Failed to delete task', error);
        res.sendStatus(500);
    }
});
