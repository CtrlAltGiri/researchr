const apiRouter = require('express').Router();
const studentRouter = require('./student/studentRouter');
const professorRouter = require('./professor/professorRouter');

apiRouter.all("*", function (req, res, next) {
    if (req.isAuthenticated())
        next('route')
    else
        res.status(401).send("Not authenticated").end();
})

// API router for /api/student
apiRouter.use("/student", studentRouter);

// API router for /api/professor
apiRouter.use("/professor", professorRouter);

module.exports = apiRouter;