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
        const errors = values[1]
        if (retVal === false) {
            return res.status(StatusCodes.BAD_REQUEST).send(errors);
        }
        else{
            let studentID = req.user._id;
            Students.findOne({_id: studentID}, function (err, student){
                if(err) {
                    console.log(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                }
                // sanity check ; shouldn't happen
                else if(!student) {
                    console.log("No student found!");
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                }
                else {
                    // check if current password matches with the one entered
                    if(student.validatePassword(req.body.current_password) !== true) {
                        console.log("Update password failed: current_password is wrong");
                        return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send("Wrong password");
                    }
                    else {
                        // check if current password matches new password
                        if(req.body.current_password === req.body.new_password) {
                            // Don't allow update
                            console.log("New password cannot be same as current password");
                            return res.status(StatusCodes.NOT_ACCEPTABLE).send("New password cannot be same as current password");
                        }
                        else {
                            // set new password
                            student.setPassword(req.body.new_password);
                            // save it to database
                            student.save({}, function (err, result){
                                if(err){
                                    console.log(err);
                                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                                }
                                else if(!result){
                                    console.log("Failed to update password for student");
                                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                                }
                                else{
                                    console.log("Password has been updated");
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
