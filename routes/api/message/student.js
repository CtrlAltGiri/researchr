const Applications = require("../../../models/applications");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ObjectID = require("bson-objectid");
const logger = require('../../../config/winston');

async function addStudentMessages(req, res) {
    // get the student ID from req
    let studentID = req.user._id;
    // get projectID from req params
    let projectID = req.params.projectID;
    // get studentID and message field from req body
    let message = req.body.message;

    // check validity of message field
    if(message && (!(typeof message === 'string') || message.length > 500)) {
        logger.ant("Invalid student message field for project: %s student: %s", projectID, studentID);
        return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
    }
    // check if projectID is a valid object id
    if(!ObjectID.isValid(projectID)){
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
    }
    // Add the message in the applications schema if application is present
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
                        fromProf: false
                    }
            }
        },
        function (err, result) {
            if (err) {
                logger.tank(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
            }
            else {
                const { n, nModified } = result;
                if (n && nModified) {
                    return res.status(StatusCodes.OK).send("Successfully added student message");
                }
                else {
                    logger.tank("Failed to add student message for project: %s student: %s", projectID, studentID);
                    return res.status(StatusCodes.BAD_REQUEST).send("Adding message failed");
                }
            }
        })
}

module.exports = { addStudentMessages };
