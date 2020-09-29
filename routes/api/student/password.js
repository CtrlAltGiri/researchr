// Contains API to allow student to change their passwords
const {StatusCodes, ReasonPhrases} = require('http-status-codes');
const passwordRouter = require('express').Router();
const mongoose = require('mongoose');
const Students = require('../../../models/students')
const {updatePasswordValidator} = require("../../../utils/formValidators/updatePasword");

passwordRouter
    .post("/", async function (req, res){
        // validate all password fields
        const values = await updatePasswordValidator(req.body);
        const retVal = values[0]
        let errors = values[1]
        if (retVal === false) {
            errors = Object.values(Object.values(errors)[0])[0];
            return res.status(StatusCodes.BAD_REQUEST).send(errors);
        }
        else{
            let studentID = req.user._id;
            Students.findOne({_id: studentID}, function (err, student){
                if(err) {
                    logger.tank(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                }
                // sanity check ; shouldn't happen
                else if(!student) {
                    logger.nuclear("No student found - Student: %s", studentID);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                }
                else {
                    // check if current password matches with the one entered
                    if(student.validatePassword(req.body.current_password) !== true) {
                        logger.ant("Update password failed: current_password is wrong - Student: %s", studentID);
                        return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send("Wrong password");
                    }
                    else {
                        // check if current password matches new password
                        if(req.body.current_password === req.body.new_password) {
                            // Don't allow update
                            logger.ant("New password cannot be same as current password - Student: %s", studentID);
                            return res.status(StatusCodes.NOT_ACCEPTABLE).send("New password cannot be same as current password");
                        }
                        else {
                            // set new password
                            student.setPassword(req.body.new_password);
                            // save it to database
                            student.save({}, function (err, result){
                                if(err){
                                    logger.tank(err);
                                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                                }
                                else if(!result){
                                    logger.tank("Failed to update password for student %s", studentID);
                                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                                }
                                else{
                                    logger.ant("Password changed - Student: %s", studentID)
                                    return res.status(StatusCodes.OK).send("Password successfully updated");
                                }
                            })
                        }

                    }
                }
            })
        }
    })


module.exports = passwordRouter;
