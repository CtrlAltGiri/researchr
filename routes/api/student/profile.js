const profileRouter = require('express').Router();
const { collegeFormValidator, workFormValidator, projectFormValidator } = require('../../../client/src/common/formValidators/cvValidator');
const {retrieveStudentDetails} = require('../utils/studentDetails');

profileRouter
    .get("/myProfile", function(req, res){
        const cvOnly = req.query.cvElements;
        const studId = req.user._id;
        const currentID = req.user._id;
        retrieveStudentDetails(studId, currentID, cvOnly, res);
    })


profileRouter
    .get('/getStudentId', function(req, res){
        res.status(200).send(req.user._id); 
    })

profileRouter
    .get("/:studentID", function(req, res){
        const cvOnly = req.query.cvElements;
        const studId = req.params.studentID;
        const currentID = req.user._id;
        retrieveStudentDetails(studId, currentID, cvOnly, res);
    });



profileRouter.route("/createProfile")
    .post(function (req, res) {

        let verification = true, validate = "";
        const studId = req.user._id;
        let newState = req.body.value, step = req.body.step;
        let update = {}
        let student = req.user;

        if (step === 1) {
            update = {
                TandC: true
            }
        }
        else if (step === 2) {

            let colleges = newState.college;
            colleges.every((college) => {
                validate = collegeFormValidator(college);
                if (!(validate === true)) {
                    verification = false;
                    return false;
                }
                return true;
            })

            let firstCollege = colleges[0];
            if(!(firstCollege.college === student.college && 
                firstCollege.degree === student.degree && 
                firstCollege.yog.toString() === student.yog.toString() &&
                firstCollege.branch === student.branch)){
                    verification = false;
                    validate = "Please choose the values from the dropdown."
                }

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
            Students.updateOne({ '_id': studId }, update, function (err, result) {
                if(err){
                    console.log(err);
                    return res.status(404).send("Failed");
                }
                const { n, nModified } = result;
                // check if document has been successfully updated in collection
                if(n){
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

module.exports = profileRouter;
