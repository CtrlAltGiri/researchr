const ProfProjects = require("../../../models/profProjects");
const Applications = require("../../../models/applications");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ObjectID = require("bson-objectid");
const Async = require('async');
const logger = require('../../../config/winston');

async function addProfessorMessages(req, res) {
    // get the professor ID from req
    let professorID = req.user._id;
    // get projectID from req params
    let projectID = req.params.projectID;
    // get studentID and message field from req body
    let studentID = req.body.studentID;
    let message = req.body.message;

    // check validity of message field
    if(message && (!(typeof message === 'string') || message.length > 500)) {
        logger.ant("Invalid professor message field for project: %s student: %s", projectID, studentID);
        return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
    }
    // check if projectID is a valid object id
    if(!ObjectID.isValid(projectID)){
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
    }
    // check if studentID is a valid object id
    if(!ObjectID.isValid(studentID)){
        return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
    }

    await Async.waterfall([
        function (callback) {
            // STEP 1: Check if the project ID and professor ID is present in the profProjects collection
            ProfProjects.findOne({_id: projectID, professorID: professorID}, function (err, project){
                if(err) {
                    logger.tank(err);
                    callback("Failed");
                }
                else if(!project) {
                    logger.ant("No project with id %s found for adding professor message", projectID);
                    callback("Invalid");
                }
                else {
                    callback(null);
                }
            })
        },
        function (callback) {
            // STEP 2: Add the message in the applications schema if application is present
            Applications.updateOne(
                {
                    _id: studentID,
                    profApplications: {
                        $elemMatch: {
                            projectID: projectID,
                            status: { $in: ["interview", "selected", "ongoing", "completed"] }
                        }
                    }
                },
                {
                    $push: {
                        'profApplications.$.messages':
                            {
                                timestamp: Date.now(),
                                message: message,
                                fromProf: true
                            }
                    }
                },
                function (err, result) {
                    if (err) {
                        logger.tank(err);
                        callback("Failed");
                    }
                    else {
                        const { n, nModified } = result;
                        if (n && nModified) {
                            callback(null, "Successful");
                        }
                        else {
                            logger.tank("Failed to add professor message for project: %s student: %s", projectID, studentID);
                            callback("Adding message failed");
                        }
                    }
                })
        }
        ], function (err, result) {
            if(err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            else {
                return res.status(StatusCodes.OK).send("Successfully added professor message");
            }
    })
}

async function getProfessorMessages(req, res) {
    // get the professor ID from req
    let professorID = req.user._id;
    // get projectID from req params
    let projectID = req.params.projectID;
    // get studentID field from req body
    let studentID = req.query.studentID;
    // check if projectID is a valid object id
    if (!ObjectID.isValid(projectID)) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
    }
    // check if studentID is a valid object id
    if (!ObjectID.isValid(studentID)) {
        return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
    }
    await Async.waterfall([
        function (callback) {
            // STEP 1: Check if the project ID and professor ID is present in the profProjects collection
            ProfProjects.findOne({_id: projectID, professorID: professorID}, function (err, project) {
                if (err) {
                    logger.tank(err);
                    callback("Failed");
                } else if (!project) {
                    logger.ant("No project with id %s found for fetching messages", projectID);
                    callback("Invalid");
                } else {
                    callback(null);
                }
            })
        },
        function (callback) {
            // STEP 2: Get all the messages from applications schema form the required student application if present
            Applications.findOne(
                {
                    _id: studentID,
                    profApplications: {
                        $elemMatch: {
                            projectID: projectID,
                            status: {$in: ["interview", "selected", "ongoing", "completed"]}
                        }
                    }
                },
                {
                    'profApplications.$': 1,
                    name: 2
                },
                function (err, application) {
                    if (err) {
                        logger.tank(err);
                        callback("Failed");
                    } else if (!application) {
                        logger.ant("No application found for fetching messages for project: %s student: %s", projectID, studentID);
                        callback("Bad request");
                    }
                    // sanity check
                    else if (application.profApplications.length <= 0) {
                        logger.nuclear("No application found for fetching messages for project: %s student: %s", projectID, studentID);
                        callback("Failed");
                    } else {
                        const messages = application.profApplications[0].messages;
                        const studentName = application.name;
                        const professorName = application.profApplications[0].professorName;
                        const projectName = application.profApplications[0].name;
                        callback(null, {
                            messages: messages,
                            studentName: studentName,
                            professorName: professorName,
                            projectName: projectName
                        })

                    }
                })
        }
    ], function (err, result) {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        } else {
            return res.status(StatusCodes.OK).send(result);
        }
    })
}


module.exports = { addProfessorMessages, getProfessorMessages };
