const express = require('express');
const apiRouter = express.Router();
const Students = require('../../models/students');
const axios = require('axios');
// /api/

/*apiRouter.route("/:endpoint")
    .get(function (req, res) {
        // authenticate first.
        console.log(req.params.endpoint);
        if (req.params.endpoint == 'passwords') {
            let a = [
                {
                    _id : 3943483948,
                    category: ["#ComputerVision", "#Machine Learning"],
                    name: "Extensive Analysis on Human Brain Signals with Machine Learning",
                    desc: "The project has been under works since the beginning of the 19th centry. Dr PBS has been working on this since 20th century and I intend to complete it before the end of this world.",
                    profName: "Dr. Bhagath Singh",
                    profDesignation: "Assistant Professor",
                    views: "1.2k",
                    comments: "10"
                },
                {
                    _id: 3948294,
                    category: ["#Software Engineering", "#Web Development"],
                    name: "API capturing algorithm to detect the presence of alien life near sector 7",
                    desc: "The project has been under works since the beginning of the 19th centry. Dr PBS has been working on this since 20th century and I intend to complete it before the end of this world.",
                    profName: "Dr. Giridhar Balachandran",
                    profDesignation: "Senior Professor",
                    views: "120.2M",
                    comments: "70"
                }
            ];

            res.json(a);
        }

        if (req.params.endpoint == "myprofile") {
            let a = {
                name: "Giridhar Balachandran", email: "giridhar.balaz@gmail.com", workExperiences: [{
                    name: "Microsoft",
                    title: "Intern",
                    startDate: "12th July, 2020",
                    endDate: "31st August, 2020",
                    description: "I did a mad ting. Made all the process 20% or up. SLA reduced by 95% got the best award woohoo killed it.",
                    url: "microsoft.com"
                },
                {
                    name: "Cevitr Ltd.",
                    title: "Intern",
                    startDate: "12th July, 2020",
                    endDate: "31st August, 2020",
                    description: "I did a mad ting. Made all the process 20% or up. SLA reduced by 95% got the best award woohoo killed it.",
                    url: "cevitr.com"
                }
                ],
                projects:[{
                    name: "IIT Bombay",
                    title: "Software Research Intern",
                    startDate: "17th Aug, 2020",
                    endDate: "19th July, 2021",
                    description: "This was the one to do man jeez. IT was mad.",
                    url: "iitb.ac.in"
                }],

                education:[{
                    name: "Manipal Institute of Technology",
                    title: "BTech. Computer Science of Engineering",
                    cgpa: 9.55,
                    url: 'manipal.edu',
                    description: "Where i learn everything bham"
                }]
            };
            res.json(a);
        }
    }); 

*/

function notAuthenticated(res){
    res.status(404).send("Not authenticated");
    console.log("Not authenticated")
}

apiRouter.get('/profile/myProfile', async function (req, res) {

    if (req.isAuthenticated()) {
        const studId = req.user._id;
        await Students.findOne({ '_id': studId }, function (err, result) {
            if (result !== null)
                res.send(result.cvElements);
        })
    }
    else{
        notAuthenticated(res);
    }
});

apiRouter.route("/profile/createProfile")
    .post(async function (req, res) {

        // TODO (Giri): Check every entry that comes in and make sure that its okay.
        // Otherwise, send appropriate error message to react.

        if (req.isAuthenticated()) {
            const studId = req.user._id;
            let newState = req.body.value, step = req.body.step;
            let update = {}

            if (step === 1) {
                update = {
                    TandC: true
                }
            }
            else if (step === 2) {
                update = {
                    "cvElements.education": {
                        school: newState.school,
                        college: newState.college
                    }
                }
            }
            else if (step === 3) {
                update = {
                    "cvElements.workExperiences": newState.workExperiences,
                    "cvElements.projects": newState.projects
                }
            }
            else if (step === 4) {
                update = {
                    "cvElements.interestTags": newState.interestTags
                }
            }

            await Students.updateOne({ '_id': studId }, update);

            res.status(200).send('success')
        }
        else{
            notAuthenticated(res);
        }
    });


apiRouter.route("/projects")
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            axios.post("http://localhost:5000/recommender", {
                filters: {
                    "work_from_home": true,
                    "start_month": 1
                },
                student_id: req.user._id,
                page_index: 0
            }).then(function (response) {
                console.log("got");
                res.send(response.data);
            }).catch(function (err) {
                res.send(err);
            })
        }
        else{
            notAuthenticated(res);
        }
    })

module.exports = apiRouter;
