const testRouter = require('express').Router();
const allTags = require('../../../utils/data/tags')
const upload = require('../../../config/upload').upload
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const logger = require('../../../config/winston');

testRouter
    .get("/platform/tagQuery", function (req, res) {

        const responseTags = []
        const query = req.query.query;
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

testRouter.route("/testUpload")
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

module.exports = testRouter;