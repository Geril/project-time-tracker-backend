const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ProjectsRouter  = require('./handlers/projects.router');
const LogsRouter  = require('./handlers/logs.router');
const UsersRouter  = require('./handlers/users.router');

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/', ProjectsRouter);
app.use('/', LogsRouter);
app.use('/', UsersRouter);

app.listen(process.env.PORT || 3000, () => console.log(
    `Your app is listening on port ${process.env.PORT || 3000}`)
);