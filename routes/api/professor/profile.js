const profileRouter = require('express').Router();
const mongoose = require('mongoose');
const Professors = require("../../../models/professors");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ObjectID = require("bson-objectid");
const {profProfileValidator} = require("../../../utils/formValidators/profProfile");

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

        // TODO(aditya): Add these check everywhere necessary
        // check if its a valid object id
        if(!ObjectID.isValid(urlProfID)){
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
        }

        // check if professor who is viewing the profile is the same as the one who is logged in
        let mine = false;
        if(professorID.equals(mongoose.Types.ObjectId(urlProfID)))
            mine = true;

        Professors.findOne({_id: professorID}, function (err, professor){
            if(err) {
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
            }
            else if(!professor) {
                console.log("No professor found");
                return res.status(StatusCodes.BAD_REQUEST).send("Invalid request");
            }
            else {
                professor = professor.toObject();
                professor = (
                    ({
                        name,
                        college,
                        designation,
                        profile
                    }) =>
                    ({
                        name,
                        college,
                        designation,
                        profile
                    }))(professor);
                professor.mine = mine;
                return res.status(StatusCodes.OK).send(professor);
            }
        })
    })


profileRouter.route('/')
    // API to update professor profile
    .post(async function (req,res){
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
                    console.log(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                }
                else {
                    const { n, nModified } = result;
                    // check if document has been successfully updated in collection
                    if(n) {
                        console.log("Successfully updated the professor profile");
                        return res.status(StatusCodes.OK).send("Successfully updated");
                    }
                    // failed update
                    else {
                        console.log("Failed to update the professor profile");
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                    }
                }
            })
    })

module.exports = profileRouter;
