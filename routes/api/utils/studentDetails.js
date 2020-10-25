const Students = require('../../../models/students');
const ObjectID = require("bson-objectid");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('../../../config/winston');

function retrieveStudentDetails(studId, currentID, cvOnly, res){

    // check if studId is a valid object id
    if(!ObjectID.isValid(studId)){
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
    }
        
    // Should not do ===, one is an ObjectID and other is a string.
    const mine = studId == currentID;      
    Students.findOne({ '_id': studId }, function (err, obj) {
        if(err){
            logger.tank(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
        }

        obj = obj.toObject();
        if(!obj){
            logger.tank("No student profile found with id: %s", studId);
            return res.status(StatusCodes.BAD_REQUEST).send("Profile not found.");
        }
        
        if(!obj.completed && cvOnly === 'false'){          
            let errorMsg;
            if(!mine){
                errorMsg = "Profile not completed";
                res.status(StatusCodes.BAD_REQUEST).send(errorMsg);
                return;
            }
        }

        obj = (({ name, c_email, college, branch, degree, yog, cvElements }) => ({ name, c_email, college, branch, degree, yog, cvElements }))(obj);
        obj.mine = mine;
        res.status(StatusCodes.OK).send(obj);
    });
}

module.exports = {retrieveStudentDetails};