const apiRouter = require('express').Router();
const studentRouter = require('./student/studentRouter');
const professorRouter = require('./professor/professorRouter');
const publicRouter = require('./public/publicRouter')

function authChecker(req, res, next){
    if (req.isAuthenticated())
        next('route')
    else
        res.status(401).send("Not authenticated").end();
}

// API router for /api/public
apiRouter.use("/public", publicRouter);

// API router for /api/student
apiRouter.use("/student", authChecker, studentRouter);

// API router for /api/professor
apiRouter.use("/professor", authChecker, professorRouter);

module.exports = apiRouter;