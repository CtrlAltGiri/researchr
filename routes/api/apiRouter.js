const apiRouter = require('express').Router();
const Students = require('../../models/students');
const ProfProjects = require('../../models/profProjects');
const axios = require('axios');
const allTags = require('../../utils/data/tags')
const upload = require('../../config/upload').upload
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const { collegeFormValidator, workFormValidator, projectFormValidator } = require('../../client/src/common/formValidators/cvValidator');

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
    const cvOnly = req.query.cvElements;
    console.log(cvOnly);
    Students.findOne({ '_id': studId }, function (err, obj) {
        if (err) { console.log(err); res.status(404).send("Error on our end."); return;}
        obj = obj.toObject();
        
        if(!obj.completed && cvOnly === 'false'){
            res.status(404).send("Profile not completed, please click edit profile to continue.");
            return;
        }

        obj = (({ name, c_email, cvElements }) => ({ name, c_email, cvElements }))(obj);
        res.send(obj);
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
            update = {
                "cvElements.interestTags": newState.interestTags,
                completed: true
            }
        }

        if (verification === true) {
            Students.updateOne({ '_id': studId }, update, function (err, raw) {
                if (err) {
                    res.status(404).send("Failed");
                }
                else {
                    res.status(200).send('Successfully updated.')
                }
            });
        }
        else {
            res.status(404).send(validate)
        }
    })

apiRouter.route("/project/:projectID")
.get(function(req, res){
    // get the projects id from request params
    let projectID = req.params.projectID;
    // query mongoDB's profProjects collection to return the project details
    ProfProjects.findOne({_id: projectID}, function (err, project){
        if(err){
            console.log(err);
            return res.status(404).send("Failed");
        }
        // if no project with the given projectID return error
        if(!project){
            console.log("No project with id ", projectID);
            return res.status(404).send("Failed");
        }
        // check if project can still be applied to and add the corresponding field 'apply'
        project.apply = project.applicationCloseDate >= Date.now;
        // send it to the front end
        return res.status(200).send(project);
    })
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

apiRouter.get("/applications" ,function(req, res){

    res.status(200).send({
        active : [{
            name: "Giridhar Balachandran",
            college: "IIT Bombay",
            status: "Active",
            createDate: "12th July, 2020"
        }],
        selected: [{
            name:"Aditya Vavre",
            college: "MIT, Manipal",
            status: "Selected",
            createDate: "17th May, 2021"
        }],
        archived: [{
            name: "Rahul Humayun",
            college: "IIT Madras",
            status: "Ongoing",
            createDate: "17th August, 2019"
        }]
    })
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
