const { getProfessorMessages, addProfessorMessages } = require("./professor");
const { addStudentMessages } = require("./student")
const messageRouter = require('express').Router();
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('../../../config/winston');

// API to handle messaging for both professor and student
messageRouter.route('/:projectID')
    // API to view messages only for professors; student can view as part of their application
    .get(function (req, res, next) {
        if(req.user.userType === "Professor"){
            getProfessorMessages(req, res)
                .then(response => logger.ant("Successfully called professor get messages API"))
                .catch(next);
        }
        else {
            return res.status(StatusCodes.BAD_GATEWAY).send("Not Allowed");
        }
    })
    // API to add message to a particular application
    .post(function (req, res, next) {
        if(req.user.userType === "Professor"){
            addProfessorMessages(req, res)
                .then(response => logger.ant("Successfully called professor add message API"))
                .catch(next);
        }
        else if (req.user.userType === "Student"){
            addStudentMessages(req, res)
                .then(response => logger.ant("Successfully called student add message API"))
                .catch(next);
        }
        else {
            return res.status(StatusCodes.BAD_GATEWAY).send("Not Allowed");
        }
    })

module.exports = messageRouter;
