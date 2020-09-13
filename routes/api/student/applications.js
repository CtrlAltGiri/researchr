const applicationsRouter = require('express').Router();
const Students = require('../../../models/students');
const mongoose = require('mongoose');
const Applications = require("../../../models/applications");
const Async = require('async');

// API to return all applications of the student and to change their status
applicationsRouter.route('/')
    // API to view all applications
    .get(function (req, res){
        let studentID = req.user._id;
        let cur_time = new Date(); //current time
        Async.waterfall([
            function (callback){
                // CHECK 1: Check if given student exists in our mongoDB's students collection
                Students.findOne({_id: studentID}, function (err, student){
                    if(err){
                        console.log(err);
                        callback("Failed");
                    }
                    // if no student found with given ID
                    else if(!student){
                        console.log("No student found with id ", studentID);
                        callback("No student found");
                    }
                    else{
                        console.log("Found applications.");
                        callback(null);
                    }
                })
            },
            function (callback){
                // All CHECKS done. Now query for applications from the applications collection
                Applications.findOne({_id: studentID}, function (err, applications){
                    if(err){
                        console.log(err);
                        callback("Failed");
                    }
                    else{
                        let all_applications = {
                            'active': [],
                            'selected': [],
                            'archived': []
                        }
                        // this will happen if student is yet to make his first application
                        if(!applications){
                            console.log("No applications found");
                            console.log("Returning default response");
                            callback(null, false, all_applications);
                        }
                        // the flow below will happen if student has previously applied before
                        else{
                            let cur_applications = applications.profApplications;
                            // active field
                            all_applications.active = cur_applications.filter(function (e){
                                return e.status === "active";
                            })
                            // archived field
                            all_applications.archived = cur_applications.filter(function (e){
                                return (e.status !== "active" && e.status !== "selected" && e.status !== "interview");
                            })
                            // selected field
                            // has time to accept offer
                            let cur_selected_true = cur_applications.filter(function (e){
                                return (e.status === "selected" && e.timeToAccept > cur_time);
                            })
                            // time to accept offer has expired but not updated in DB
                            let cur_selected_false = cur_applications.filter(function (e){
                                return (e.status === "selected" && e.timeToAccept <= cur_time);
                            })
                            // in interview stage as decided by the professor
                            let cur_interview = cur_applications.filter(function (e){
                                return e.status === "interview";
                            })
                            all_applications.selected = cur_selected_true.concat(cur_interview);
                            if(cur_selected_false.length > 0) {
                                // if there are any applications that are not yet updated in the database
                                console.log("Found applications that are to be updated");
                                cur_selected_false.forEach(function (element){
                                    element.status = "declined";
                                })
                                all_applications.archived = all_applications.archived.concat(cur_selected_false);
                                callback(null, true, all_applications);
                            }
                            else{
                                callback(null, false, all_applications);
                            }
                        }
                    }
                })
            },
            function (update, applications, callback){
                // Update status of projects whose time to accept has expired to status `declined`. Decided by arg `update`
                if(update !== true){
                    callback(null, applications);
                }
                else{
                    // Update status in applications collection in mongoDB
                    Applications.updateOne(
                        {_id: studentID},
                        {
                            $set: {
                                'profApplications.$[element].status': "declined"
                            }
                        },
                        {
                            multi: true,
                            arrayFilters: [
                                {"element.status": "selected", "element.timeToAccept": {$lte: cur_time}}
                            ]
                        },
                        function (err, result){
                            if(err){
                                console.log(err);
                                callback("Failed");
                            }
                            else{
                                const { n, nModified } = result;
                                if (n && nModified) {
                                    console.log("Update successful");
                                    callback(null, applications);
                                }
                                else {
                                    // TODO(aditya): If update to DB fails even then send proper response?
                                    //               Returning error for now.
                                    callback("Update failed");
                                }
                            }
                        }
                    )
                }
            }
        ],function (err, applications){
            if(err){
                res.status(404).send(err);
            }
            else{
                // return last element because it will contain the result to be returned i.e. applications
                // res.status(200).send(result[result.length-1]);
                res.status(200).send(applications);
            }
        })
    })
    // API for student to change application status
    .post(function (req, res){
        let studentID = req.user._id;
        let projectID = req.body.projectID;
        let newStatus = req.body.status;
        let cur_time = new Date();
        // Do a preliminary check on new status
        if (
            newStatus !== "ongoing" &&
            newStatus !== "declined"
        ) {
          return res.status(404).send("Not allowed");
        }

        Async.series([
            // TODO(aditya): Check if this is actually needed. Mostly not needed because of Check 2.
            function (callback){
                // CHECK 1: Check if given student exists in our mongoDB's students collection
                Students.findOne({_id: studentID}, function (err, student){
                    if(err){
                        console.log(err);
                        callback("Failed");
                    }
                    // if no student found with given ID
                    else if(!student){
                        console.log("No student found with id ", studentID);
                        callback("No student found");
                    }
                    else{
                        console.log("student: ", student);
                        callback(null, 1);
                    }
                })
            },
            function (callback){
                // CHECK 2: Check if student has applied for the project and its current status and if change to new status is allowed
                Applications.findOne({_id: studentID, 'profApplications.projectID': projectID}, function (err, result) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    // check if result is null which means that the student has not applied for this project/ project does not exist
                    else if (!result) {
                        console.log("Student has not applied for the project");
                        callback("No application found");
                    }
                    else if (result) {
                        // get the required application from result
                        let application = result.profApplications.find(
                            element => {
                                return element.projectID.equals(mongoose.Types.ObjectId(projectID));
                            })
                        // sanity check. ideally application should not be undefined.
                        if(!application){
                            callback("Error in updating status");
                        }
                        // Allow condition 1
                        if (application.status === "selected" && application.timeToAccept > cur_time && newStatus === "ongoing") {
                            console.log("Allowed condition 1");
                            callback(null, 21);
                        }
                        // Allow condition 2
                        else if (application.status === "selected" && newStatus === "declined") {
                            console.log("Allowed condition 2");
                            callback(null, 22);
                        }
                        // Disallow all other changes to status
                        else {
                            callback("Status change not allowed");
                        }
                    }
                })
            },
            function (callback){
                // FINAL step: Make the status update in applications collection based on newStatus
                // If newStatus is "ongoing" i.e. student has accepted to work on a project then update its status in DB
                // and update the status of projects with status as active/selected/interview to cancelled by default
                if(newStatus === "ongoing") {
                    Applications.updateOne(
                        {_id: studentID},
                        {
                            $set: {
                                'profApplications.$[element1].status': newStatus,
                                'profApplications.$[element].status': "cancelled"
                            }
                        },
                        {
                            arrayFilters: [
                                {
                                    "element.status": {$in: ["active", "selected", "interview"]},
                                    "element.projectID": {$ne: projectID}
                                },
                                {
                                    "element1.projectID": projectID
                                }],
                            multi: true
                        },
                        function (err, result) {
                            if (err) {
                                console.log(err);
                                callback("Failed");
                            } else {
                                const {n, nModified} = result;
                                if (n && nModified) {
                                    callback(null, "Successful");
                                } else {
                                    callback("Update failed");
                                }
                            }
                        })
                }
                // Else if newStatus is declined then just update the status of the given project in the DB
                else if(newStatus === "declined"){
                    Applications.updateOne(
                        {_id: studentID, 'profApplications.projectID': projectID},
                        {
                            $set: {
                                'profApplications.$.status': newStatus
                            }
                        },
                        function (err, result){
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
                                    callback("Update failed");
                                }
                            }
                        })
                }
                // Sanity check. Should ideally never enter this else statement.
                else{
                    callback("Not supported");
                }
            }
        ], function (err, result){
            if(err){
                res.status(404).send(err);
            }
            else{
                res.status(200).send(result);
            }
        })
    })

module.exports = applicationsRouter