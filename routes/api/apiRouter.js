const apiRouter = require('express').Router();
const studentRouter = require('./student/studentRouter');
const professorRouter = require('./professor/professorRouter');
const messageRouter = require('./message/message');
const publicRouter = require('./public/publicRouter')
const logger = require('../../config/winston');

function authChecker(req, res, next){
    if (req.isAuthenticated())
        next('route')
    else{
        logger.info("Not authenticated - neither student nor professor - %s", req.originalUrl);
        res.status(401).send("Not authenticated").end();
    }   
}

// API router for /api/public
apiRouter.use("/public", publicRouter);

// API router for /api/student
apiRouter.use("/student", authChecker, studentRouter);

// API router for /api/professor
apiRouter.use("/professor", authChecker, professorRouter);

// API router for /api/message
apiRouter.use("/message", authChecker, messageRouter);

module.exports = apiRouter;