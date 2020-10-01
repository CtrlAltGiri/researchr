const profileRouter = require('express').Router();
const Professors = require("../../../models/professors");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { profProfileValidator } = require("../../../utils/formValidators/profProfile");
const { profProfileDetails } = require('../utils/profDetails');
const logger = require('../../../config/winston');

profileRouter.get("/getProfile", function(req, res){
    res.send(req.user._id);
})

// API to view professor profile
profileRouter.route('/:professorID')
    // API to fetch professor profile from professors collection and return it
    .get(function (req, res){
        // get professor ID from req
        let professorID = req.user._id;
        // get profID from url
        let urlProfID = req.params.professorID;

        // call the function.
        profProfileDetails(professorID, urlProfID, res);
    })


profileRouter.route('/')
    // API to update professor profile
    .post(async function (req,res, next){
        try {
            // get professor ID from req
            let professorID = req.user._id;
            // check validity of request body
            const values = await profProfileValidator(req.body.profile);
            const retVal = values[0];
            const errors = values[1];
            if (retVal === false) {
                let error = Object.values(Object.values(errors)[0])[0]
                return res.status(StatusCodes.BAD_REQUEST).send(error);
            }
            // all checks passed

            let updateProfile = (({areasOfInterest, courses, education, books, publications, projects, patents, url}) =>
                ({areasOfInterest, courses, education, books, publications, projects, patents, url}))(req.body.profile);

            Professors.updateOne({_id: professorID},
                {
                    $set: {
                        profile: updateProfile
                    }
                },
                function (err, result){
                    if(err){
                        logger.tank(err);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                    }
                    else {
                        const { n, nModified } = result;
                        // check if document has been successfully updated in collection
                        if(n) {
                            logger.ant("Successfully updated the professor profile for professor: %s", professorID);
                            return res.status(StatusCodes.OK).send("Successfully updated");
                        }
                        // failed update
                        else {
                            logger.tank("Failed to update the professor profile for professor: %s", professorID);
                            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                        }
                    }
                })
        }
        catch (err) {
            next(err);
        }
    })

module.exports = profileRouter;
