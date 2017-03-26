const express = require('express');
const ProjectsRouter = express.Router();
const { Projects } = require('./projects.model');

// Init some dummy data
Projects.create('Lorem ipsum', 'Lorem ipsum dolor sit amet', 1, '00b1be66-02a8-41c9-bb81-240eca7beac8-g28');
Projects.create('Quisquam eaque', 'Quisquam eaque consequuntur maxime deleniti', 1, 'b823cd29-423f-4c45-90ab-27efef0e1966-g28');
Projects.create('Laboriosam, voluptas', 'Laboriosam, voluptas id, adipisci consequuntur', 1, '734742af-9a5e-42ce-8300-39b94eb8d157-g28');

const checkProject = (req, res, next) => {
    const { id } = req.params;
    const project = Projects.get(id);
    if (project) {
        next();
    } else {
        res.status(404).send('Project not found');
    }
}

ProjectsRouter.get('/projects', (req, res) => {
    res.json(Projects.get());
});

ProjectsRouter.route('/project/:id')
    .get(checkProject, (req, res) => {
        res.json(Projects.get(req.params.id));
    })
    .delete(checkProject, (req, res) => {
        Projects.delete(req.params.id);
        res.json(Projects.get());
    })
    .put(checkProject, (req, res) => {
        const requiredFields = ['id', 'name', 'description', 'author'];
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

        const project = Projects.update({
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            author: req.body.author,
        });
        res.status(201).json(project);


    });

ProjectsRouter.post('/project', (req, res) => {
    const requiredFields = ['name', 'description', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            return res.status(400).send(message);
        }
    }
    const project = Projects.create(req.body.name, req.body.description, req.body.author);
    res.status(201).json(project);
});

module.exports = ProjectsRouter;