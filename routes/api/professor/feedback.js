const feedbackRouter = require('express').Router();
const ProfProjects = require("../../../models/profProjects");
const Applications = require("../../../models/applications");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ObjectID = require("bson-objectid");
const Async = require('async');

// API to get all applications for a particular project
feedbackRouter.route("/:projectID")
    .post(function (req,res){
        // get the professor ID from req
        let professorID = req.user._id;
        // get projectID from req params
        let projectID = req.params.projectID;
        // get studentID, status and optional message field from req body
        let studentID = req.body.studentID;
        let feedback = req.body.feedback;
        let rating = req.body.rating;

        // TODO(aditya): Add a form validator later for this validation
        // check validity of feedback field
        if(!(feedback) || !(typeof feedback === 'string') || feedback.length > 500) {
            console.log("Invalid feedback field");
            return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
        }
        // check validity of rating field
        if(![1, 2, 3, 4, 5].includes(rating)) {
            console.log("Invalid rating field");
            return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
        }
        // check if projectID is a valid object id
        if(!ObjectID.isValid(projectID)){
            return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
        }
        // check if studentID is a valid object id
        if(!ObjectID.isValid(studentID)){
            return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
        }

        Async.waterfall([
            function (callback) {
                // STEP 1: Check if the project ID and professor ID is present in the profProjects collection
                ProfProjects.findOne({_id: projectID, professorID: professorID}, function (err, project){
                    if(err) {
                        console.log(err);
                        callback("Failed");
                    }
                    else if(!project) {
                        console.log("No project found for adding feedback");
                        callback("Invalid");
                    }
                    else {
                        callback(null);
                    }
                })
            },
            function(callback) {
                // FINAL STEP: Find the student application for the `ongoing` project and add to its feedback array
                Applications.updateOne(
                    {
                        _id: studentID,
                        profApplications: {
                            $elemMatch: {
                                projectID: projectID,
                                status: "ongoing"
                            }
                        }
                    },
                    {
                        $push: {
                            "profApplications.$.feedbacks": {
                                timestamp: Date.now(),
                                feedback: feedback,
                                rating: rating
                            }
                        }
                    },
                    function (err, result) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    else {
                        const { n, nModified } = result;
                        if (n && nModified) {
                            callback(null, "Successful");
                        }
                        else {
                            callback("Error in adding feedback");
                        }
                    }
                })
            }
        ], function (err, result){
            if(err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            else {
                return res.status(StatusCodes.OK).send("Successfully added feedback");
            }
        })
    })


module.exports = feedbackRouter;
