const apiRouter = require('express').Router();
const Students = require('../../models/students');
const axios = require('axios');
const allTags = require('../../utils/data/tags')
const upload = require('../../config/upload').upload
const Grid = require('gridfs-stream');
const mongoose = require('mongoose')

function notAuthenticated(res) {
    res.status(404).send("Not authenticated");
    console.log("Not authenticated")
}

apiRouter.get("/", function (req, res) {
    if (req.isAuthenticated())
        next()
    else {
        notAuthenticated();
    }
})

apiRouter.get('/profile/myProfile', async function (req, res) {
    if (req.isAuthenticated()) {
        const studId = req.user._id;
        await Students.findOne({ '_id': studId }, function (err, result) {
            if (result !== null)
                res.send(result.cvElements);
        })
    }
    else {
        notAuthenticated(res);
    }
});

apiRouter.route("/profile/createProfile")
    .post(async function (req, res) {

        // TODO (Giri): Check every entry that comes in and make sure that its okay.
        // Otherwise, send appropriate error message to react.
        // Especially tags. 2 tags / project. 3 interest tags.

        if (req.isAuthenticated()) {
            const studId = req.user._id;
            let newState = req.body.value, step = req.body.step;
            console.log(newState.interestTags)
            let update = {}

            if (step === 1) {
                update = {
                    TandC: true
                }
            }
            else if (step === 2) {
                update = {
                    "cvElements.education": {
                        school: newState.school,
                        college: newState.college
                    }
                }
            }
            else if (step === 3) {
                update = {
                    "cvElements.workExperiences": newState.workExperiences,
                    "cvElements.projects": newState.projects
                }
            }
            else if (step === 4) {
                update = {
                    "cvElements.interestTags": newState.interestTags
                }
            }

            await Students.updateOne({ '_id': studId }, update);

            res.status(200).send('success')
        }
        else {
            notAuthenticated(res);
        }
    });


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

    if (req.isAuthenticated()) {
        const query = req.query.text;

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
    }
    else {
        notAuthenticated(res);
    }
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
