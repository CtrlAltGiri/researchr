const Professors = require('../../../models/professors');
const ObjectID = require("bson-objectid");
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');

function profProfileDetails(professorID, urlProfID, res){

    // TODO(aditya): Add these check everywhere necessary
    // check if its a valid object id
    if(!ObjectID.isValid(urlProfID)){
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
    }   

    // check if professor who is viewing the profile is the same as the one who is logged in
    let mine = false;
    if(professorID && professorID.equals(mongoose.Types.ObjectId(urlProfID)))
        mine = true;

    Professors.findOne({_id: urlProfID}, function (err, professor){
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
}

module.exports = { profProfileDetails }