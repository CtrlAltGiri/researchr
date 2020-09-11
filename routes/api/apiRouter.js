const apiRouter = require('express').Router();
const Students = require('../../models/students');
const axios = require('axios');
const allTags = require('../../utils/data/tags')
const upload = require('../../config/upload').upload
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
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
        if (err) { console.log(err); res.status(404).send("Failed") }
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
    
    let projectID = req.params.projectID;
    res.status(200).send(["What is your name?", "What is your age?", "Are you a homosexual?"])
})

apiRouter.route("/projects")
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            axios.post("http://localhost:5000/recommender", {
                filters: {
                    "work_from_home": true,
                    "start_month": 1
                },
                student_id: req.user._id,
                page_index: 0
            }).then(function (response) {
                console.log("got");
                res.send(response.data);
            }).catch(function (err) {
                res.send(err);
            })
        }
        else {
            notAuthenticated(res);
        }
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
