const { getProfessorMessages, addProfessorMessages } = require("./professor");
const { addStudentMessages } = require("./student")
const messageRouter = require('express').Router();
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

// API to handle messaging for both professor and student
messageRouter.route('/:projectID')
    // API to view messages only for professors; student can view as part of their application
    .get(async function (req, res) {
        if(req.user.userType === "Professor"){
            await getProfessorMessages(req, res);
        }
        else {
            return res.status(StatusCodes.BAD_GATEWAY).send("Not Allowed");
        }
    })
    // API to add message to a particular application
    .post(async function (req, res) {
        if(req.user.userType === "Professor"){
            await addProfessorMessages(req, res);
        }
        else if (req.user.userType === "Student"){
            await addStudentMessages(req, res);
        }
        else {
            return res.status(StatusCodes.BAD_GATEWAY).send("Not Allowed");
        }
    })

module.exports = messageRouter;
