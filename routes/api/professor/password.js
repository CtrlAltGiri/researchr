// Contains API to allow professors to change their passwords
const { StatusCodes } = require('http-status-codes');
const passwordRouter = require('express').Router();
const Professors = require("../../../models/professors");
const { updatePasswordValidator } = require("../../../utils/formValidators/updatePasword");

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
            // get professor ID from req
            let professorID = req.user._id;
            Professors.findOne({_id: professorID}, function (err, professor){
                if(err) {
                    console.log(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                }
                // sanity check ; shouldn't happen
                else if(!professor) {
                    console.log("No professor found!");
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                }
                else {
                    // check if current password matches with the one entered
                    if(professor.validatePassword(req.body.current_password) !== true) {
                        console.log("Update password for professor failed: current_password is wrong");
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
                            professor.setPassword(req.body.new_password);
                            // save it to database
                            professor.save({}, function (err, result){
                                if(err){
                                    console.log(err);
                                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                                }
                                else if(!result){
                                    console.log("Failed to update password for professor");
                                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                                }
                                else{
                                    console.log("Password has been updated for professor");
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
