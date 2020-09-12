const apiRouter = require('express').Router();
const Students = require('../../models/students');
const ProfProjects = require('../../models/profProjects');
const axios = require('axios');
const allTags = require('../../utils/data/tags')
const upload = require('../../config/upload').upload
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const Applications = require("../../models/applications");
const {sopFormCheck} = require("../../client/src/common/formValidators/sopValidator");
const {answersFormCheck} = require("../../client/src/common/formValidators/sopValidator");
const { collegeFormValidator, workFormValidator, projectFormValidator } = require('../../client/src/common/formValidators/cvValidator')
const Async = require('async');

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

// API to view a project and apply for it
apiRouter.route("/project/:projectID")
    // API to get all details related to a project
    .get(function(req, res){
        // get the projects id from request params
        let projectID = req.params.projectID;
        // get student id from req
        let studentID = req.user._id;
        // query mongoDB's profProjects collection to return the project details
        Async.waterfall([
            function (callback){
                //CHECK 1: Check if such a project exists and if its open and also increment its views by 1
                ProfProjects.findOneAndUpdate({_id: projectID}, {$inc: {views: 1}}, {new: true, useFindAndModify: false}, function (err, project) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    // if no project with the given projectID return error
                    else if (!project) {
                        console.log("No project with id ", projectID);
                        callback("No project found");
                    }
                    else{
                        project = project.toObject();
                        // check if project can still be applied to and add the corresponding field 'apply'
                        project.apply = project.applicationCloseDate >= Date.now();
                        if (project.apply === false) {
                            // send project to the front end with apply = false
                            project.errorMsg = "This project is no longer accepting new applicants";
                        }
                        callback(null, project);
                    }
                })
            },
            function(project, callback){
                // CHECK 2: Check if student has completed his CV
                // First check if project.apply === false and call callback immediately
                if(project.apply === false){
                    callback(null, project);
                }
                else{
                    // Else do the check 2
                    Students.findOne({_id: studentID}, function (err, student){
                        if(err){
                            console.log(err);
                            callback("Failed");
                        }
                        // no student with given id exists in mongoDB
                        else if(!student){
                            console.log("No student found with id ", studentID);
                            callback("No student found");
                        }
                        // if student has not completed his CV
                        else if(student && !student.completed){
                            console.log("Not completed CV id: ", studentID);
                            project.apply = false;
                            project.errorMsg = "Please complete your profile first";
                        }
                        callback(null, project);
                    })
                }
            },
            function (project, callback){
                // CHECK 3: Check if student has already applied for the given project
                // First check if project.apply === false and call callback immediately
                if(project.apply === false){
                    callback(null, project);
                }
                else{
                    // Else do the check 3
                    Applications.findOne({_id: studentID, 'profApplications.projectID': projectID}, function (err, result){
                        if(err){
                            console.log(err);
                            callback("Failed");
                        }
                        // check if result is not null which means that the student has already applied for this project
                        else if(result){
                            console.log("Already applied for this project");
                            project.apply = false;
                            project.errorMsg = "You have already applied for this project";
                        }
                        callback(null, project);
                    })
                }
            },
            function (project, callback){
                // CHECK 4: Check if student already has an ongoing project
                // First check if project.apply === false and call callback immediately
                if(project.apply === false){
                    callback(null, project);
                }
                else{
                    // Else do the check 4
                    Applications.findOne({_id: studentID, 'profApplications.status': "ongoing"}, function (err, result){
                        if(err){
                            console.log(err);
                            callback("Failed");
                        }
                        // check if result is not null which means that the student has already applied for this project
                        else if(result){
                            console.log("Already has ongoing project");
                            project.apply = false;
                            project.errorMsg = "You already have an ongoing project";
                        }
                        callback(null, project);
                    })
                }
            }
        ],
        function (err, project){
            if(err){
                return res.status(404).send(err);
            }
            else{
                console.log("project: ", project);
                return res.status(200).send(project);
            }
        })
    })
    // API to add an application to a project
    .post(function (req, res) {
        //check if request is valid
        if(!req.body.answers || !req.body.sop){
            console.log("Invalid application request");
            return res.status(404).send("Both answers and SOP are required");
        }
        // check if all answers are valid
        if(answersFormCheck(req.body.answers) !== true){
            console.log("Invalid answers");
            return res.status(404).send("Answers not validated");
        }
        // check if sop is valid
        if(sopFormCheck(req.body.sop) !== true){
            console.log("Invalid answers");
            return res.status(404).send("SOP not validated");
        }
        // checked if request is valid
        // get the projects id from request params
        let projectID = req.params.projectID;
        // get student id from req
        let studentID = req.user._id;

        // check few conditions in series and finally add application if none of the conditions check fail
        Async.waterfall([
            function (callback){
                // CHECK 1: Check if given projectID exists and its applications are still open
                ProfProjects.findOne({_id: projectID, applicationCloseDate: {$gt: Date.now()}}, function (err, project){
                    if(err){
                        console.log(err);
                        callback("Failed");
                    }
                    // if no project with the given projectID or if its a closed project return error
                    else if(!project){
                        console.log("Applications closed or no project with id ", projectID);
                        callback("Applications closed or invalid project");
                    }
                    else if(project){
                        callback(null, project);
                    }
                })
            },
            function (project, callback) {
                // CHECK 2: Check if student has completed his CV
                Students.findOne({_id: studentID}, function (err, student) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    // no student with given id exists in mongoDB
                    else if (!student) {
                        console.log("No student found with id ", studentID);
                        callback("No student found");
                    }
                    // if student has not completed his CV
                    else if (student && !student.completed) {
                        console.log("Not completed CV, student id: ", studentID);
                        callback("Not completed CV");
                    }
                    else if (student && student.completed) {
                        callback(null, project);
                    }
                })
            },
            function (project, callback){
                //CHECK 3: Check if student has a project that is ongoing
                Applications.findOne({_id: studentID, 'profApplications.status': "ongoing"}, function (err, result) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    // check if result is not null which means that the student has an ongoing project already
                    else if (result) {
                        console.log("Already has an ongoing project");
                        callback("Already has an ongoing project");
                    }
                    else if (!result) {
                        callback(null, project);
                    }
                })
            },
            function (project, callback){
                // CHECK 4: Check if the student has already applied for the project
                Applications.findOne({_id: studentID, 'profApplications.projectID': projectID}, function (err, result) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    // check if result is not null which means that the student has already applied for this project
                    else if (result) {
                        console.log("Already applied for this project");
                        callback("Already applied");
                    }
                    else if (!result) {
                        callback(null, project);
                    }
                })
            },
            function (project, callback){
                // FINAL STEP: add application to applications collection
                Applications.updateOne(
                    {_id: mongoose.Types.ObjectId(studentID)},
                    {
                        $push : {
                            profApplications: {
                                projectID: mongoose.Types.ObjectId(projectID),
                                name: project.name,
                                professorName: project.professorName,
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
                            callback("Failed");
                        }
                        else{
                            const { n, nModified, upserted } = result;
                            // check if document has been successfully updated/added in collection
                            if((n && upserted) || (n && nModified)) {
                                console.log("Successfully added a new application");
                                callback(null, result);
                            }
                            // failed update or add
                            else {
                                console.log("Failed to add new application");
                                callback("Failed to add new application");
                            }
                        }
                    });
            }
        ], function (err, result){
            if(err){
                return res.status(404).send(err);
            }
            else{
                console.log("result: ", result);
                return res.status(200).send(result);
            }
        });
    })

// API to show all projects on the main platform page to the students
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



// API to return all applications of the student and to change their status
apiRouter.route('/applications')
    // API to view all applications
    .get(function (req, res){
        let studentID = req.user._id;

        Async.series([
            function (callback){
                // CHECK 1: check if given student exists in our mongoDB
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
                            callback(null, all_applications);
                        }
                        // the flow below will happen if student has previously applied before
                        else{
                            let cur_applications = applications.profApplications;
                            console.log("current applications: ", cur_applications);
                            all_applications.active = cur_applications.filter(function (e){
                                return e.status === "active";
                            })
                            all_applications.selected = cur_applications.filter(function (e){
                                return e.status === "selected";
                            })
                            all_applications.archived = cur_applications.filter(function (e){
                                return e.status !== "active" && e.status !== "selected";
                            })
                            callback(null, all_applications);
                        }
                    }
                })
            }
        ],function (err, result){
            if(err){
                res.status(404).send(err);
            }
            else{
                // return last element because it will contain the result to be returned i.e. applications
                res.status(200).send(result[result.length-1]);
            }
        })
    })
    // API for student to change application status
    .post(function (req, res){
        let studentID = req.user._id;
        let projectID = req.body.projectID;
        let newStatus = req.body.status;

        Async.series([
            //TODO(aditya): Finish this
        ], function (err, result){
            if(err){
                res.status(404).send(err);
            }
            else{
                // return last element because it will contain the result to be returned i.e. applications
                res.status(200).send(result);
            }
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
