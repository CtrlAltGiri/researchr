const express = require('express');
const apiRouter = express.Router();

apiRouter.route("/:endpoint")
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
                researchExperiences:[{
                    name: "IIT Bombay",
                    title: "Software Research Intern",
                    startDate: "17th Aug, 2020",
                    endDate: "19th July, 2021",
                    description: "This was the one to do man jeez. IT was mad.",
                    url: "iitb.ac.in"
                }],

                education:[
                    {
                        name: "Manipal Institute of Technology",
                        title: "BTech. Computer Science of Engineering",
                        cgpa: 9.55,
                        url: 'manipal.edu',
                        description: "Where i learn everything bham"
                    }
                ]
            };
            res.json(a);
        }
    })

module.exports = apiRouter;