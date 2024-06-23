import * as jwt from 'jsonwebtoken';
import express, { Express, Request, Response } from "express";
import * as dotenv from 'dotenv';
import { connectToDb, getDb } from './mongodb';
import ProjectModel from '../../models/projectModel';

dotenv.config();

const cors = require('cors');

const app: Express = express()

const port = process.env.PORT || 3000;

const tokenSecret = process.env.TOKEN_SECRET as string
console.log('Token Secret:', tokenSecret);
let refreshToken: string
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

app.put('/projects/:id', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const updatedProject: ProjectModel = req.body;
        const result = await db.collection('projects').findOneAndUpdate(
            { $set: updatedProject },
            {returnOriginal: false}
        );
            res.send(result.value);
        } catch (error) {
        console.error('Failed to update project', error);
        res.sendStatus(500);
    }
});

app.delete('/projects/:id', async (req: Request, res: Response) => {
    try {
        const db = getDb();
        await db.collection('projects').deleteOne(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('Failed to delete project', error);
        res.sendStatus(500);
    }
});