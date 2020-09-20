const Students = require('../../../models/students');

function retrieveStudentDetails(studId, currentID, cvOnly, res){
        
    // Should not do ===, one is an ObjectID and other is a string.
    const mine = studId == currentID;      
    Students.findOne({ '_id': studId }, function (err, obj) {
        if(err){
            console.log(err);
            return res.status(404).send("Profile not found.");
        }

        obj = obj.toObject();
        if(!obj){
            return res.status(404).send("Profile not found.");
        }
        
        if(!obj.completed && cvOnly === 'false'){
            
            let errorMsg;
            if(mine){
                errorMsg = "Profile not completed, please click edit profile to continue";
            }
            else{
                errorMsg = "Profile not completed.";
            }
            res.status(404).send(errorMsg);
            return;
        }

        obj = (({ name, c_email, college, branch, degree, yog, cvElements }) => ({ name, c_email, college, branch, degree, yog, cvElements }))(obj);
        obj.mine = mine;
        res.send(obj);
    });
}

module.exports = {retrieveStudentDetails};