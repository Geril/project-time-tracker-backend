const express = require('express');
const LogsRouter = express.Router();
const { Logs } = require('./logs.model');
const { Projects } = require('./projects.model');

// Init some dummy data
Logs.create('00b1be66-02a8-41c9-bb81-240eca7beac8-g28', 1, Date.now() - 1800000, Date.now() - 1620000);
Logs.create('00b1be66-02a8-41c9-bb81-240eca7beac8-g28', 1, Date.now() - 480000, Date.now() - 240000);
Logs.create('00b1be66-02a8-41c9-bb81-240eca7beac8-g28', 1, Date.now() - 5400000, Date.now() - 600000);

Logs.create('b823cd29-423f-4c45-90ab-27efef0e1966-g28', 1, Date.now() - 60000, Date.now() - 30000);
Logs.create('b823cd29-423f-4c45-90ab-27efef0e1966-g28', 1, Date.now() - 900000, Date.now() - 480000);
Logs.create('b823cd29-423f-4c45-90ab-27efef0e1966-g28', 1, Date.now() - 2700000, Date.now() - 720000);

Logs.create('734742af-9a5e-42ce-8300-39b94eb8d157-g28', 1, Date.now() - 1320000, Date.now() - 540000);
Logs.create('734742af-9a5e-42ce-8300-39b94eb8d157-g28', 1, Date.now() - 360000, Date.now() - 120000);
Logs.create('734742af-9a5e-42ce-8300-39b94eb8d157-g28', 1, Date.now() - 3600000, Date.now() - 3180000);


const checkLog = (req, res, next) => {
    const { id } = req.params;
    const log = Logs.get(id);
    if (log) {
        next();
    } else {
        res.status(404).send('Log not found');
    }
}

const checkProject = (req, res, next) => {
    const { projectId } = req.params;
    const project = Projects.get(projectId);
    if (project) {
        next();
    } else {
        res.status(404).send('Project not found');
    }
}

LogsRouter.route('/log/:id')
    .get(checkLog, (req, res) => {
        res.json(Logs.get(req.params.id));
    })
    .delete(checkLog, (req, res) => {
        Logs.delete(req.params.id);
        res.json(Logs.get());
    })
    .put(checkLog, (req, res) => {
        const requiredFields = ['id', 'projectId', 'userId', 'from', 'to'];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!(field in req.body)) {
                const message = `Missing ${field} in request body`;
                return res.status(400).send(message);
            }
        }

        if (req.params.id !== req.body.id) {
            const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
            return res.status(400).send(message);
        }

        if (req.params.from > req.body.to) {
            const message = `Invalid time values`;
            return res.status(400).send(message);
        }

        const log = Logs.update({
            id: req.params.id,
            projectId: req.body.projectId,
            userId: req.body.userId,
            from: req.body.from,
            to: req.body.to,
        });
        res.status(201).json(log);


    });

LogsRouter.post('/log', (req, res) => {
    const requiredFields = ['projectId', 'userId', 'from'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            return res.status(400).send(message);
        }
    }
    const { userId } = req.body;
    const runningLog = Logs.get().find((item) => item.userId === Number(userId) && item.to === 'running');
    if(runningLog) {
        return res.status(400).send('There is one logger already running');
    }
    const log = Logs.create(req.body.projectId, req.body.userId, req.body.from);
    res.status(201).json(log);
});

LogsRouter.get('/running-log/:userId', (req, res) => {
    const { userId } = req.params;
    const runningLog = Logs.get().find((item) => item.userId === Number(userId) && item.to === 'running');
    if(!runningLog) {
        return res.status(404).send('There is no logger running');
    }
    res.json(runningLog);
});

LogsRouter.route('/logs/:projectId')
    .get(checkProject, (req, res) => {
        const { projectId } = req.params;
        const logs = Logs.get().filter((item) => item.projectId === projectId);
        res.json(logs);
    })
module.exports = LogsRouter;