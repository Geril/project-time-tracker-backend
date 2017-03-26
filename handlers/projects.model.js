const uuid = require('uuid');

function StorageException(message) {
    this.message = message;
    this.name = "StorageException";
}

const Projects = {
    create: function (name, description, author, id) {
        const project = {
            id: id || uuid.v4(),
            name: name,
            description: description,
            author: author,
            created: Date.now()
        };
        this.projects.push(project);
        return project;
    },
    get: function (id = null) {
        if (id !== null) {
            return this.projects.find(project => project.id === id);
        }
        return this.projects.sort(function (a, b) {
            return b.created - a.created
        });
    },
    delete: function (id) {
        const projectIndex = this.projects.findIndex(
            project => project.id === id);
        if (projectIndex > -1) {
            this.projects.splice(projectIndex, 1);
        }
    },
    update: function (updatedProject) {
        const { id } = updatedProject;
        const projectIndex = this.projects.findIndex(
            project => project.id === updatedProject.id);
        if (projectIndex === -1) {
            throw StorageException(
                `Can't update item \`${id}\` because doesn't exist.`)
        }
        this.projects[projectIndex] = Object.assign(
            this.projects[projectIndex], updatedProject);
        return this.projects[projectIndex];
    }
};

function createProjectsModel() {
    const storage = Object.create(Projects);
    storage.projects = [];
    return storage;
}


module.exports = { Projects: createProjectsModel() };