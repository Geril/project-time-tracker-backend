const express = require('express');
const UsersRouter = express.Router();

const serverStarted = Date.now();
UsersRouter.get('/user/basic-info', (req, res) => {
    res.json({
        "id": 1,
        "nickName": "JohnDoe",
        "created": serverStarted,
    });
});

module.exports = UsersRouter;