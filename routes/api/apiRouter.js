const apiRouter = require('express').Router();
const Students = require('../../models/students');
const ProfProjects = require('../../models/profProjects');
const axios = require('axios');
const allTags = require('../../utils/data/tags')
const upload = require('../../config/upload').upload
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const Applications = require("../../models/applications");
const {ObjectID} = require("mongoose");
const {sopFormCheck} = require("../../client/src/common/formValidators/sopValidator");
const {answersFormCheck} = require("../../client/src/common/formValidators/sopValidator");
const { collegeFormValidator, workFormValidator, projectFormValidator } = require('../../client/src/common/formValidators/cvValidator')

function notAuthenticated(res) {
    res.status(404).send("Not authenticated");
    console.log("Not authenticated")
}

apiRouter.all("*", function (req, res, next) {
    if (req.isAuthenticated())
        next('route')
    else
        res.status(404).end(() => console.log("Not authenticated"));
})

apiRouter.get('/profile/myProfile', function (req, res) {
    const studId = req.user._id;
    Students.findOne({ '_id': studId }, function (err, obj) {
        if(err){
            console.log(err);
            return res.status(404).send("Failed");
        }
        if(!obj){
            console.log("No student found with id ", studId);
            return res.status(404).send("Failed");
        }
        res.send(obj.cvElements);
    });
});

apiRouter.route("/profile/createProfile")
    .post(function (req, res) {

        let verification = true, validate = "";
        const studId = req.user._id;
        let newState = req.body.value, step = req.body.step;
        let update = {}

        if (step === 1) {
            update = {
                TandC: true
            }
        }
        else if (step === 2) {

            let colleges = newState.college;
            colleges.every((college, index) => {
                validate = collegeFormValidator(college);
                if (!(validate === true)) {
                    verification = false;
                    return false;
                }
                return true;
            })

            update = {
                "cvElements.education": {
                    school: newState.school,
                    college: newState.college
                }
            }
        }
        else if (step === 3) {
            // TODO (Giri): What happens if both are NULL?

            let works = newState.workExperiences;
            let projects = newState.projects;

            works.every((work, index) => {
                validate = workFormValidator(work);
                if (!(validate === true)) {
                    verification = false;
                    return false;
                }
                return true;
            })

            if (verification === true) {
                projects.every((project, index) => {
                    validate = projectFormValidator(project);
                    if (!(validate === true)) {
                        verification = false;
                        return false;
                    }
                    return true;
                })
            }
            update = {
                "cvElements.workExperiences": newState.workExperiences,
                "cvElements.projects": newState.projects
            }
        }
        else if (step === 4) {

            // TODO (Giri): Update the status of the student as completed,
            // if he has education marked in his profile.
            update = {
                "cvElements.interestTags": newState.interestTags
            }
        }

        if (verification === true) {
            Students.updateOne({ '_id': studId }, update, function (err, result) {
                if(err){
                    console.log(err);
                    return res.status(404).send("Failed");
                }
                const { n, nModified } = result;
                // check if document has been successfully updated in collection
                if(n && nModified){
                    console.log("Successfully updated student cv");
                    return res.status(200).send("Successfully updated");
                }
                else{
                    console.log("No student match found");
                    return res.status(404).send("Failed student cv update");
                }
            });
        }
        else{
            res.status(404).send(validate)
        }
    })

apiRouter.route("/project/:projectID")
    .get(function(req, res){
        // get the projects id from request params
        let projectID = req.params.projectID;
        // get student id from req
        let studentID = req.user._id;
        // query mongoDB's profProjects collection to return the project details
        // first check if such a project exists and if its open and also increment its views by 1
        ProfProjects.findOneAndUpdate({_id: projectID}, {$inc: {views: 1}}, {new: true}, function (err, project){
            if(err){
                console.log(err);
                return res.status(404).send("Failed");
            }
            // if no project with the given projectID return error
            if(!project){
                console.log("No project with id ", projectID);
                return res.status(404).send("Failed");
            }
            project = project.toObject();
            // check if project can still be applied to and add the corresponding field 'apply'
            project.apply = project.applicationCloseDate >= Date.now;
            if(project.apply === false){
                // send project to the front end with apply = false
                project.errorMsg = "This project is no longer accepting new applicants";
                return res.status(200).send(project);
            }
            //else if project can still be applied to, check if student has already applied for it
            Applications.findOne({_id: studentID, 'profApplications.projectID': projectID}, function (err, result){
                if(err){
                    console.log(err);
                    return res.status(404).send("Failed");
                }
                // check if result is not null which means that the student has already applied for this project
                if(result){
                    console.log("Already applied for this project");
                    project.apply = false;
                    project.errorMsg = "You have already applied for this project";
                    return res.status(200).send(project);
                }
            })
            // final check: check if student has completed his CV
            Students.findOne({_id: studentID}, function (err, student){
                if(err){
                    console.log(err);
                    return res.status(404).send("Failed");
                }
                // no student with given id exists in mongoDB
                if(!student){
                    console.log("No student found with id ", studentID);
                    return res.status(404).send("Failed");
                }
                // if student has not completed his CV
                if(student && !student.completed){
                    console.log("Not completed CV id: ", studentID);
                    project.apply = false;
                    project.errorMsg = "Please complete your profile first";
                    return res.status(200).send(project);
                }
            })
            // send project to the front end with apply = true/false
            return res.status(200).send(project);
        })
    })
    .post(function (req, res) {
        //check if request is valid
        if(!req.body.answers || !req.body.sop){
            console.log("Invalid application request");
            return res.status(404).send("Both answers and SOP are required");
        }
        // check if all answers are valid
        if(answersFormCheck(req.body.answers) === false){
            console.log("Invalid answers");
            return res.status(404).send("Answers not validated");
        }
        // check if sop is valid
        if(sopFormCheck(req.body.sop) === false){
            console.log("Invalid answers");
            return res.status(404).send("SOP not validated");
        }
        // checked if request is valid
        // get the projects id from request params
        let projectID = req.params.projectID;
        // get student id from req
        let studentID = req.user._id;

        // first check if given projectID exists and its applications are still open
        ProfProjects.findOne({_id: projectID, applicationCloseDate: {$gt: Date.now()}}, function (err, project){
            if(err){
                console.log(err);
                return res.status(404).send("Failed");
            }
            // if no project with the given projectID or if its a closed project return error
            if(!project){
                console.log("Applications closed or no project with id ", projectID);
                return res.status(404).send("Applications closed or invalid project");
            }
        })

        // now check if the student has already applied for the project
        Applications.findOne({_id: studentID, 'profApplications.projectID': projectID}, function (err, result){
            if(err){
                console.log(err);
                return res.status(404).send("Failed");
            }
            // check if result is not null which means that the student has already applied for this project
            if(result){
                console.log("Already applied for this project");
                return res.status(404).send("Already applied");
            }
        })

        // final check: check if student has completed his CV
        Students.findOne({_id: studentID}, function (err, student){
            if(err){
                console.log(err);
                return res.status(404).send("Failed");
            }
            // no student with given id exists in mongoDB
            if(!student){
                console.log("No student found with id ", studentID);
                return res.status(404).send("Failed");
            }
            // if student has not completed his CV
            if(student && !student.completed){
                console.log("Not completed CV, student id: ", studentID);
                return res.status(404).send("Profile CV not completed");
            }
        })

        // no application found && valid project && CV completed => allow student to apply for the project
        Applications.updateOne(
            {_id: ObjectID(studentID)},
            {
                $push : {
                    profApplications: {
                        projectID: ObjectID(projectID),
                        status: 'active',
                        doa: Date.now(),
                        answers: req.body.answers,
                        sop: req.body.sop
                    }
                }
            },
            {upsert: true}, // insert if not already exists
            function (err, result){
                if(err){
                    console.log(err);
                    return res.status(404).send("Failed");
                }
                const { n, nModified } = result;
                // check if document has been successfully updated/added in collection
                if(nModified) {
                    console.log("Successfully added a new application");
                    return res.status(200).send("Successfully added application");
                }
                // failed update or add
                else {
                    console.log("Failed to add new application");
                    return res.status(404).send("Failed");
                }
            });
    })

apiRouter.route("/projects")
    .get(function (req, res) {
        // query all prof projects with application close date > cur date
        ProfProjects.find({applicationCloseDate: {$gt: Date.now()}}, function (err, projects){
            if(err){
                console.log(err);
                return res.status(404).send("Failed");
            }
            // send all projects to front end
            return res.status(200).send(projects);
        })
    })

apiRouter.get("/platform/tagQuery", function (req, res) {

    const responseTags = []
    allTags.forEach((tag) => {
        tag.split("-").every(function (miniTag) {
            if (miniTag.startsWith(query)) {
                responseTags.push(tag);
                return false;
            }
            else {
                return true;
            }
        })
    })

    res.status(200).send(responseTags);
});

apiRouter.route("/testUpload")
    .post(upload, function (req, res) {
        res.status(200).send("done");
    })
    .get(function (req, res) {
        var gfs = new Grid(mongoose.connection.db, mongoose.mongo);
        gfs.collection('uploads');

        gfs.files.findOne({ filename: req.user._id }, function (err, file) {
            if (!file || file.length === 0) {
                res.status(404).send("Not found / Error")
                return;
            }
        })

        readstream = gfs.createReadStream({
            filename: req.user._id
        })
        readstream.on('error', function (err) {
            console.log('An error occurred!', err);
            throw err;
        });

        readstream.pipe(res);

    })
    .delete(function (req, res) {
        gfs.files.findOne({ filename: req.user._id }, function (err, file) {
            gfs.remove({ _id: file._id.toString(), root: 'uploads' }, (err, gridStore) => {
                if (err) {
                    return res.status(404).json({ err: err });
                }
            })
        })
    })

module.exports = apiRouter;
