// Contains API to allow professors to change their passwords
const { StatusCodes } = require('http-status-codes');
const passwordRouter = require('express').Router();
const Professors = require("../../../models/professors");
const { updatePasswordValidator } = require("../../../utils/formValidators/updatePasword");
const logger = require('../../../config/winston');

passwordRouter
    .post("/", async function (req, res, next){
        try {
            // validate all password fields
            const values = await updatePasswordValidator(req.body);
            const retVal = values[0]
            let errors = values[1]
            if (retVal === false) {
                errors = Object.values(Object.values(errors)[0])[0];
                return res.status(StatusCodes.BAD_REQUEST).send(errors);
            }
            else{
                // get professor ID from req
                let professorID = req.user._id;
                Professors.findOne({_id: professorID}, function (err, professor){
                    if(err) {
                        logger.tank(err);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                    }
                    // sanity check ; shouldn't happen
                    else if(!professor) {
                        logger.nuclear("No professor found with id: %s", professorID);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                    }
                    else {
                        // check if current password matches with the one entered
                        if(professor.validatePassword(req.body.current_password) !== true) {
                            return res.status(StatusCodes.UNAUTHORIZED).send("Wrong password");
                        }
                        else {
                            // check if current password matches new password
                            if(req.body.current_password === req.body.new_password) {
                                // Don't allow update
                                return res.status(StatusCodes.NOT_ACCEPTABLE).send("New password cannot be same as current password");
                            }
                            else {
                                // set new password
                                professor.setPassword(req.body.new_password);
                                // save it to database
                                professor.save({}, function (err, result){
                                    if(err){
                                        logger.tank(err);
                                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                                    }
                                    else if(!result){
                                        logger.tank("Failed to update password for professor: %s", professorID);
                                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                                    }
                                    else{
                                        logger.ant("Password has been updated for professor: %s", professorID);
                                        return res.status(StatusCodes.OK).send("Password successfully updated");
                                    }
                                })
                            }

                        }
                    }
                })
            }
        }
        catch (err) {
            next(err);
        }
    })


module.exports = passwordRouter;
