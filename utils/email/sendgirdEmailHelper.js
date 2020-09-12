require('dotenv').config()
const sg = require('sendgrid')(process.env.SendGridApiKey);

const sendVerificationEmail = (to, name, token) => {
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
                email: "jzllnontepedmwxqml@kiabws.online"
            },
            content: [
                {
                    type: 'text/html',
                    value: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>researchR</title></head><body><p>Hello ${name}. Click on this link to verify your email <a href="${hostUrl}/verify?token=${token}">${hostUrl}/verify?token=${token}</a></p></body></html>`
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

const sendPasswordResetEmail = (to, token) => {
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
                email: "jzllnontepedmwxqml@kiabws.online"
            },
            content: [
                {
                    type: 'text/html',
                    value: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>researchR</title></head><body><p>Click on this link to reset your password <a href="${hostUrl}/reset?token=${token}">${hostUrl}/reset?token=${token}</a></p></body></html>`
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

exports.sendVerificationEmail = sendVerificationEmail
exports.sendPasswordResetEmail = sendPasswordResetEmail
