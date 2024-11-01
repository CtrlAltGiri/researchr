require('dotenv').config()
const sg = require('sendgrid')(process.env.SendGridApiKey);

const sendVerificationEmail = (to, name, token, type) => {
    const hostUrl = process.env.hostURL;
    const request = sg.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: to
                        }
                    ],
                    subject:"Verify Your Email"
                }
            ],
            from: {
                email: "aditya@researchr.in",
                name: "Team researchR"
            },
            content: [
                {
                    type: 'text/html',
                    value: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>researchR</title></head><body><p>Hello ${name}. Click on this link to verify your email <a href="${hostUrl}/verify/${type}?token=${token}">${hostUrl}/verify/${type}?token=${token}</a></p></body></html>`
                }
            ]
        }
    });

    return new Promise(function (resolve, reject) {
        sg.API(request, function (error, response) {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(response);
            }
        });
    });
};

const sendPasswordResetEmail = (to, token, type) => {
    const hostUrl = process.env.hostURL;
    const request = sg.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: to
                        }
                    ],
                    subject:"Reset Your Password"
                }
            ],
            from: {
                email: "aditya@researchr.in",
                name: "Team researchR"
            },
            content: [
                {
                    type: 'text/html',
                    value: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>researchR</title></head><body><p>Click on this link to reset your password <a href="${hostUrl}/reset/${type}?token=${token}">${hostUrl}/reset/${type}?token=${token}</a></p></body></html>`
                }
            ]
        }
    });

    return new Promise(function (resolve, reject) {
        sg.API(request, function (error, response) {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(response);
            }
        });
    });
};


const sendContactUsEmail = (name, from, message) => {
    const request = sg.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: "aditya@researchr.in"
                        }
                    ],
                    subject:"Someone reached out to us"
                }
            ],
            from: {
                email: "aditya@researchr.in",
                name: "ContactUs researchR"
            },
            content: [
                {
                    type: 'text/html',
                    value: `<!DOCTYPE html><html lang="en">
                            <head>
                            <meta charset="UTF-8">
                            <title>researchR</title>
                            </head>
                            <body>
                            <p> Name: ${name}</p>
                            <p> Email: ${from}</p>
                            <p> Message: ${message}</p>
                            </body></html>`
                }
            ]
        }
    });

    return new Promise(function (resolve, reject) {
        sg.API(request, function (error, response) {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(response);
            }
        });
    });
};

exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.sendContactUsEmail = sendContactUsEmail;
