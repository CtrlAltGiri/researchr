const publicRouter = require('express').Router();
const { retrieveStudentDetails } = require('../utils/studentDetails');
const { profProfileDetails } = require('../utils/profDetails');

publicRouter
    .get("/student/:studentID", function(req, res){
        const cvOnly = req.query.cvElements;
        const studId = req.params.studentID;
        const currentID = Buffer.from('undefined');
        retrieveStudentDetails(studId, currentID, cvOnly, res);
    });

publicRouter
    .get("/professor/:professorID", function(req, res){
        const urlID = req.params.professorID;
        const profID = undefined;
        profProfileDetails(profID, urlID, res);
    })



module.exports = publicRouter;