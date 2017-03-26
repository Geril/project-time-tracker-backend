const uuid = require('uuid');

function StorageException(message) {
    this.message = message;
    this.name = "StorageException";
}

const Logs = {
    create: function (projectId, userId, from, to) {
        const log = {
            id: uuid.v4(),
            projectId: projectId,
            userId: userId,
            from: from,
            to: to || 'running',
        };
        this.logs.push(log);
        return log;
    },
    get: function (id = null) {
        if (id !== null) {
            return this.logs.find(log => log.id === id);
        }
        return this.logs.sort(function (a, b) {
            return b.from - a.from
        });
    },
    delete: function (id) {
        const logIndex = this.logs.findIndex(
            log => log.id === id);
        if (logIndex > -1) {
            this.logs.splice(logIndex, 1);
        }
    },
    update: function (updatedLog) {
        const { id } = updatedLog;
        const logIndex = this.logs.findIndex(
            log => log.id === updatedLog.id);
        if (logIndex === -1) {
            throw StorageException(
                `Can't update item \`${id}\` because doesn't exist.`)
        }
        this.logs[logIndex] = Object.assign(
            this.logs[logIndex], updatedLog);
        return this.logs[logIndex];
    }
};

function createLogsModel() {
    const storage = Object.create(Logs);
    storage.logs = [];
    return storage;
}


module.exports = { Logs: createLogsModel() };