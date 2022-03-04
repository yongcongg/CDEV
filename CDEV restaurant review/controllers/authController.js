"use strict"

const AuthDB = require('../models/AuthDB');
const UsersDB = require('../models/UsersDB')
const User = require('../models/User');
const SocialsDB = require('../models/SocialsDB');
const { OAuth2Client } = require('google-auth-library');
const speakeasy = require('speakeasy')
var QRCode = require('qrcode');

var authDB = new AuthDB();
var usersDB = new UsersDB();
var socialsDB = new SocialsDB();
var moment = require('moment');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');
const validator = require("validator");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { response } = require('express');

require('dotenv').config()

function authUser(request, respond) {
    var usernameOrEmail = request.body.input;
    var password = request.body.password;
    authDB.authUser(usernameOrEmail, function (error, result) {
        if (error) {
            respond.json(error);
        }
        if (result.length == 0) {
            respond.json("User not found! Please create account")
        }
        else {
            bcrypt.compare(password, result[0].password, function (error, isMatch) {
                if (error) {
                    respond.json(error);
                } else if (!isMatch) {
                    respond.json("Wrong password!")
                } else {
                    if (result[0].verified == 0) {
                        respond.json("Please activate account!")
                    }
                    if (result[0].twoFA == 1) {
                        // send token to access 2FA page
                        const twoFAtoken = jwt.sign({ userid: result[0]._id }, process.env.TWOFA_KEY, { expiresIn: '3min' })
                        respond.json({ twoFAtoken: twoFAtoken, twoFA: "enabled" })
                    }
                    else {
                        const accessToken = jwt.sign({ userid: result[0]._id }, process.env.SECRET_KEY, { expiresIn: '15min' })
                        const refreshToken = jwt.sign({ userid: result[0]._id }, process.env.SECRET_KEY2, { expiresIn: '1d' })
                        authDB.whitelistToken(refreshToken, jwt_decode(refreshToken).exp, (error, result) => {
                            if (error) respond.json(error)
                            else respond.json({ accessToken: accessToken, refreshToken: refreshToken })
                        })
                    }
                }
            });
        }
    });
}

function usernameCheck(request, respond) {
    var username = request.body.username
    authDB.checkUsername(username, function (error, result) {
        if (result.length != 0) {
            respond.json("taken")
            console.log(result)
        }
        else {
            respond.json("!taken")
        }
    });
}

function checkEmail(request, respond) {
    var email = request.body.input
    if (validator.isEmail(email)) {
        authDB.checkEmail(email, function (error, result) {
            if (result.length != 0) {
                respond.json("taken")
            }
            else {
                respond.json(error)
            }
        });
    }
    else {
        respond.json("invalid")
    }

}

function signUp(request, respond) {
    var defaultPic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJUExURbOzs////9ra2tYEXekAAATcSURBVHja7Z09bttAFIRFAizonkdgkVvwCCq8hOCKZZBT8BLs0wgIcsokCPLjxCbfSpz9LHnmAvth9s17K4paHQ6WZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWZVmWdbGWlL6iAOm7xhkGQAkSTfATID3RAOkjmIKfmmmAEQLofgGkiQaAktD/BkgnGoCpwybBFvwNgFjwDICwoE2wBc8BTjRAwgEmtgiJibA8B0hD4fXP/6xfugzb9J+KJrH+f/2yZdi/ADCyG1B2D5YXAU6wAQX34GUDyrWCh1fWL7YH/WsAiesBRVtB+zrACS3BUjlY2YEyOWjWAI7sDhTZg9UdKDEP2nUAfRC7dQB9ENfX1xdBtQEgL4JmC+DIloC+CLbWVxfBZgmoi6DZBtB2gn4bQFuFyzbAI1uD4nNZFQFQVmEbARjYGtRWYRcBOLEhkMagjqyvbMahEChj0MYAdDFoYgATm0JlDrsYwIlNoRIgtr6uEdRBgJEGSHAf0nWilgZoogADDTCxjfANABzZTqxrhTjAkuBejAOkmwEY7xQgPAxV49AAVRxgph2Y79OBWwIYDGAAAxjAAJ4FdsAHEgMYwAAGMIABDOBnRO/+MZ0dMIAB7hTgYAADvPsU9DRAgsdxmwFwgndAY8GSAzChGdDsQZUFMLI1KAlikwcwsyFQPKztaIAlD2C6P4B0YwBHO/DuHTDAcH8Ay40B7D+OuxsDgE/lijMhDpB3JhS8V5t3KsY/F+AAgvfra3gWZQ6DQQCwsI0wsxUqAHq2D+V1Isn7/fgzopptA3k5HCQACxuCrBzSj2pFP/Fo2RTmzEPRb81qdBZm5XAQAXRsCjNiIFo/PI5kP3yuyFGUEwPdr+/hFIbH0SwD6NkQRGMgvIWjZVMYzaHyJhY4BMEYDEKAjk1hMIfC9UMxkN5JVcEhCI0j7bVgcApDMRikAD0bgsg4Et/O17IpjMQAvyBRfUXkwoYgkMP5AMdAvP5mDPCLUvGrYvUXFi/kKArEYJAD9GwItmJQ4MroihxF2+MIv7V7KgDQsSHYmAYF1l+NAX53fZnb++EQrMZgKgLQc8ehrSos9D8iFdmI16vwWAhgYWtwpQrnQgAdW4Ovb8EjDVCqBg/kLF6dRqUMqOgSqOgQtPQWNHQR9m+2E5fqAx09jRf4PHKgT2Q1+7loFeCINsJiVdjCn8xWP5zOaBso1QsX+sMp/Iho4yEV/YCkRBF08LPqA/y0fvNxvbwTbH1zOZFdoEQQt7+4nNkdUO9B4P2BR9gA7R6E3uc7wQakcWYNeAN/Z8T/lQ3+FxaiIHyIv93/hG7AD31EN+CHPlMJkDWDzDs4dieoU0IJ6iVdoB3r4Jwu0heoAP/oU/EOJOlID+kK7VCKV62/A8FlAdiP4Or1ryU4p+s1wutfc0D5kPbRBK9/6RHpYbf1LyuDOu2oSzZh2RNgLDiBdjoltmlnzWABXNIMzrsD5FnQ7r9+1rcZtWD9rCD0CoCMXiAxIMeCswYgXIataP1wEnsVwIhWQLwMGx1AbA86HUDsGx3h+iNcAsHnyAmugZoGsAN2wA7YATtgB+yAHbADdsAO2AE7YAfsgB2wA3bADtgBO2AH7IAdsAO4A5ZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWdZ70zfEOlBzdVBO/QAAAABJRU5ErkJggg=="
    var date = new Date();
    var datetime = moment(date).format('D MMMM YYYY @ hh:mm:ss A');
    if (validator.isEmail(request.body.email)) {
        bcrypt.hash(request.body.password, 10, (err, hash) => {
            var user = new User(null, request.body.first_name, request.body.last_name, request.body.username, request.body.email, request.body.gender, request.body.address, request.body.phone_number, hash, defaultPic, datetime.toString());

            authDB.signUp(user, (error, result) => {
                if (error) {
                    respond.json(error);
                }
                else {
                    var userid = result.insertId

                    // async email
                    jwt.sign({ user: userid }, process.env.SECRET_ACTIVATE, { expiresIn: '30min' }, (err, token) => {
                        const url = `https://127.0.0.1:5501/verify.html?token=${token}`;

                        const sgMail = require('@sendgrid/mail')

                        sgMail.setApiKey(process.env.SENDGRID_KEY)
                        const msg = {
                            to: request.body.email, // Change to your recipient
                            from: process.env.GMAIL_USER, // Change to your verified sender
                            subject: 'Email Verification',
                            text: ' ',
                            html: `<!DOCTYPE html>
                            <html>

                            <head>
                                <title></title>
                                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                <style type="text/css">
                                    @media screen {
                                        @font-face {
                                            font-family: 'Lato';
                                            font-style: normal;
                                            font-weight: 400;
                                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                        }

                                        @font-face {
                                            font-family: 'Lato';
                                            font-style: normal;
                                            font-weight: 700;
                                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                        }

                                        @font-face {
                                            font-family: 'Lato';
                                            font-style: italic;
                                            font-weight: 400;
                                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                        }

                                        @font-face {
                                            font-family: 'Lato';
                                            font-style: italic;
                                            font-weight: 700;
                                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                        }
                                    }

                                    /* CLIENT-SPECIFIC STYLES */
                                    body,
                                    table,
                                    td,
                                    a {
                                        -webkit-text-size-adjust: 100%;
                                        -ms-text-size-adjust: 100%;
                                    }

                                    table,
                                    td {
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                    }

                                    img {
                                        -ms-interpolation-mode: bicubic;
                                    }

                                    /* RESET STYLES */
                                    img {
                                        border: 0;
                                        height: auto;
                                        line-height: 100%;
                                        outline: none;
                                        text-decoration: none;
                                    }

                                    table {
                                        border-collapse: collapse !important;
                                    }

                                    body {
                                        height: 100% !important;
                                        margin: 0 !important;
                                        padding: 0 !important;
                                        width: 100% !important;
                                    }

                                    /* iOS BLUE LINKS */
                                    a[x-apple-data-detectors] {
                                        color: inherit !important;
                                        text-decoration: none !important;
                                        font-size: inherit !important;
                                        font-family: inherit !important;
                                        font-weight: inherit !important;
                                        line-height: inherit !important;
                                    }

                                    /* MOBILE STYLES */
                                    @media screen and (max-width:600px) {
                                        h1 {
                                            font-size: 32px !important;
                                            line-height: 32px !important;
                                        }
                                    }

                                    /* ANDROID CENTER FIX */
                                    div[style*="margin: 16px 0;"] {
                                        margin: 0 !important;
                                    }
                                </style>
                            </head>

                                <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                                    <!-- HIDDEN PREHEADER TEXT -->
                                    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <!-- LOGO -->
                                    <tr>
                                        <td bgcolor="#FFA73B" align="center">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                <tr>
                                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                <tr>
                                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome ${request.body.first_name}!</h1>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                            <p style="margin: 0;">We're excited to have you get started. First, please press the button below to activate your account.</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="left">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                                            <tr>
                                                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="${url}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr> <!-- COPY -->
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                            <p style="margin: 0;">Cheers,<br>Live2Eat</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                    
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </body>

                            </html>`,
                        }
                        sgMail
                            .send(msg)
                            .then(() => {
                                respond.json('Email sent! Please activate your account')
                            })
                            .catch((error) => {
                                respond.json(error)
                            })
                    });
                }
            });
        });
    }
    else {
        respond.json({ invalid: "true" })
    }
}

function activateAccount(request, respond) {
    jwt.verify(request.params.token, process.env.SECRET_ACTIVATE, (error, decoded) => {
        if (error) {
            respond.json(error)
        }
        else{
            authDB.activateAccount(decoded.user, function (error, result) {
                if (error) {
                    respond.json(error);
                }
                else {
                    respond.json(result)
                }
            });
        }
        
    });
}

function generateAccessToken(request, respond) {
    const refreshToken = request.body.token;
    if (refreshToken == null) {
        return respond.json("no token given")
    }

    authDB.getToken(refreshToken, function (error, result) {
        if (error) respond.json(error)

        if (result.length == 0) respond.json('your token is not valid, please login')

        else {
            jwt.verify(refreshToken, process.env.SECRET_KEY2, (error, user) => {
                if (error) {
                    respond.json(error)
                } else {
                    const accessToken = jwt.sign({ userid: user.userid }, process.env.SECRET_KEY, { expiresIn: '0.5h' })
                    respond.json({ accessToken: accessToken })
                }
            })
        }
    });
}

function logout(request, respond) {
    var refreshToken = request.body.token
    jwt.verify(refreshToken, process.env.SECRET_KEY2, (error, decoded) => {
        if (error) respond.json(error);

        if (decoded) {
            authDB.logout(refreshToken, function (error, result) {
                if (error) respond.json(error);

                if (result.affectedRows == 0) respond.json("logged out")

                else respond.json("logged out successfully");

            });
        }
    });
}

function forgetPasswordEmail(request, respond) {
    var email = request.body.email;
    authDB.identifyIdFromEmail(email, function (error, result) {
        if (error) {
            respond.json("A reset password link has been sent to " + email + " successfully")
        }
        else if (result.length == 0) {
            respond.json("A reset password link has been sent to " + email + " successfully")
        }
        else {
            console.log(result)
            var userid = result[0]._id;

            usersDB.getUserPasswordUpdatedAt(userid, function (error, result) {
                if (error) {
                    console.log(error)
                } else {
                    var SECRET_KEY = result[0].password + ' - ' + result[0].updated_at;
                    jwt.sign({ user: userid }, SECRET_KEY, { expiresIn: '30min' }, (error, token) => {
                        const url = `https://127.0.0.1:5501/reset-password.html?token=${token}`;
                        const sgMail = require('@sendgrid/mail')

                        sgMail.setApiKey(process.env.SENDGRID_KEY)
                        const msg = {
                            to: email, // Change to your recipient
                            from: process.env.GMAIL_USER, // Change to your verified sender
                            subject: 'Reset Password request',
                            text: ' ',
                            html: `<!DOCTYPE html>
                            <html>

                            <head>
                                <title></title>
                                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                <style type="text/css">
                                    @media screen {
                                        @font-face {
                                            font-family: 'Lato';
                                            font-style: normal;
                                            font-weight: 400;
                                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                        }

                                        @font-face {
                                            font-family: 'Lato';
                                            font-style: normal;
                                            font-weight: 700;
                                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                        }

                                        @font-face {
                                            font-family: 'Lato';
                                            font-style: italic;
                                            font-weight: 400;
                                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                        }

                                        @font-face {
                                            font-family: 'Lato';
                                            font-style: italic;
                                            font-weight: 700;
                                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                        }
                                    }

                                    /* CLIENT-SPECIFIC STYLES */
                                    body,
                                    table,
                                    td,
                                    a {
                                        -webkit-text-size-adjust: 100%;
                                        -ms-text-size-adjust: 100%;
                                    }

                                    table,
                                    td {
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                    }

                                    img {
                                        -ms-interpolation-mode: bicubic;
                                    }

                                    /* RESET STYLES */
                                    img {
                                        border: 0;
                                        height: auto;
                                        line-height: 100%;
                                        outline: none;
                                        text-decoration: none;
                                    }

                                    table {
                                        border-collapse: collapse !important;
                                    }

                                    body {
                                        height: 100% !important;
                                        margin: 0 !important;
                                        padding: 0 !important;
                                        width: 100% !important;
                                    }

                                    /* iOS BLUE LINKS */
                                    a[x-apple-data-detectors] {
                                        color: inherit !important;
                                        text-decoration: none !important;
                                        font-size: inherit !important;
                                        font-family: inherit !important;
                                        font-weight: inherit !important;
                                        line-height: inherit !important;
                                    }

                                    /* MOBILE STYLES */
                                    @media screen and (max-width:600px) {
                                        h1 {
                                            font-size: 32px !important;
                                            line-height: 32px !important;
                                        }
                                    }

                                    /* ANDROID CENTER FIX */
                                    div[style*="margin: 16px 0;"] {
                                        margin: 0 !important;
                                    }
                                </style>
                            </head>
                                <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                                    <!-- HIDDEN PREHEADER TEXT -->
                                    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We received a request to reset your password. </div>
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <!-- LOGO -->
                                    <tr>
                                        <td bgcolor="#FFA73B" align="center">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                <tr>
                                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                <tr>
                                                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Reset Password request</h1>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                            <p style="margin: 0;">We received a request to reset your password. Please click on the link below to reset your password. The link will expire in 30 minutes.</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="left">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                                            <tr>
                                                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="${url}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Reset Password</a></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr> <!-- COPY -->
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                            <p style="margin: 0;">${url}</p>
                                                        </td>
                                                    </tr>
                                            
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                            <p style="margin: 0;">Cheers,<br>Live2Eat</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                    
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                            </html>`,
                        }
                        sgMail
                            .send(msg)
                            .then(() => {
                                respond.json("A reset password link has been sent to " + email + " successfully")
                            })
                            .catch((error) => {
                                respond.json(error)
                            })
                    })
                }
            });
        }
    });
}

function resetPasswordToken(request, respond) {
    // decoding jwt token ONLY
    try {
        var userid = jwt_decode(request.params.token).user;
        usersDB.getUserPasswordUpdatedAt(userid, function (error, result) {
            if (error) {
                respond.json(error)
            }
            if (result.length == 0) {
                respond.json("user does not exist")
            }
            else {
                // verifying jwt token with current hashed password as key
                var SECRET_KEY = result[0].password + ' - ' + result[0].updated_at;
                jwt.verify(request.params.token, SECRET_KEY, (error, result) => {
                    if (error) {
                        respond.json(error);
                    } else {
                        // function to reset password. jwt token will not be valid if password has changed
                        var date = new Date();
                        var datetime = moment(date).format('D MMMM YYYY @ hh:mm:ss A');

                        // hash password
                        bcrypt.hash(request.body.password, 10, (err, hash) => {
                            authDB.resetPassword(hash, datetime, userid, function (error, result) {
                                if (error) {
                                    respond.json(error);
                                } else {
                                    respond.json(result);
                                }
                            });
                        });
                    }
                })
            }
        });
    } catch (error) {
        respond.status(400).json("Invalid Token given")
    }

}

function googleSignUp(request, respond) {
    var token = request.body.token;
    var provider = request.body.provider

    const client = new OAuth2Client(process.env.CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const ID = payload['sub'];
        const fullName = payload['name']
        const username = uuidv4()
        const firstName = payload['given_name'];
        const lastName = payload['family_name'];
        const profile_pic = payload['picture'];
        const email = payload['email'];

        var date = new Date();
        var datetime = moment(date).format('D MMMM YYYY @ hh:mm:ss A');

        var randomPassword = crypto.randomBytes(49).toString('base64');

        bcrypt.hash(randomPassword, 10, (err, hash) => {
            var user = new User(null, firstName, lastName, username, email, null, null, null, hash, profile_pic, datetime.toString());
            authDB.signUp(user, (error, result) => {
                if (error) {
                    if (error.errno == 1062) {
                        respond.json("An account has already been registered with this email. Please login")
                    }
                    else {
                        respond.json(error);
                    }
                }
                else {
                    var userid = result.insertId
                    authDB.signupSocial(ID, provider, userid, function (error, result) {
                        if (error) {
                            respond.json(error);
                        }
                        else {
                            authDB.activateAccount(userid, function (error, result) {
                                if (error) {
                                    respond.json(error)
                                }
                                else {
                                    socialsDB.googleConnected(userid, function(error, result){
                                        if(error){
                                            respond.json(error)
                                        }
                                        else{
                                            respond.json("signed up with Google successfully")
                                        }
                                    })   
                                }
                            })
                        }
                    });
                }
            });
        });
    }
    verify().catch(console.error);
}

function googleLogin(request, respond) {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    var token = request.body.token;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        authDB.loginSocial(userid, function (error, result) {
            if (result.length == 0) {
                respond.json("user not found");
            }
            else if (error) {
                respond.json(error);
            }
            else {
                const accessToken = jwt.sign({ userid: result[0].user_account_id }, process.env.SECRET_KEY, { expiresIn: '0.5h' })
                const refreshToken = jwt.sign({ userid: result[0].user_account_id }, process.env.SECRET_KEY2, { expiresIn: '7d' })
                authDB.whitelistToken(refreshToken, jwt_decode(refreshToken).exp, (error, result) => {
                    if (error) respond.json(error)
                    else respond.json({ accessToken: accessToken, refreshToken: refreshToken })
                })
            }
        })
    }
    verify().catch(console.error);

    // var userSocial = jwt_decode(token);

    // var userid = userSocial.sub;
    // var fullName = userSocial.name;
    // var firstName = userSocial.given_name;
    // var lastName = userSocial.family_name;
    // var profile_pic = userSocial.picture;
    // var email = userSocial.email;

}

function facebookLogin(request, respond) {
    var facebookID = request.body.ID
    authDB.loginSocial(facebookID, function (error, result) {
        if (result.length == 0) {
            respond.json("user not found");
        }
        else if (error) {
            respond.json(error);
        }
        else {
            const accessToken = jwt.sign({ userid: result[0].user_account_id }, process.env.SECRET_KEY, { expiresIn: '0.5h' })
            const refreshToken = jwt.sign({ userid: result[0].user_account_id }, process.env.SECRET_KEY2, { expiresIn: '7d' })
            authDB.whitelistToken(refreshToken, jwt_decode(refreshToken).exp, (error, result) => {
                if (error) respond.json(error)
                else respond.json({ accessToken: accessToken, refreshToken: refreshToken })
            })
        }
    })
}

function facebookSignUp(request, respond) {
    var facebookID = request.body.id
    var provider = "Facebook"
    var firstName = request.body.firstName
    var lastName = request.body.lastName
    var email = request.body.email
    var profile_pic = request.body.profilePic
    var username = uuidv4()

    var date = new Date();
    var datetime = moment(date).format('D MMMM YYYY @ hh:mm:ss A');

    var randomPassword = crypto.randomBytes(50).toString('base64');

    bcrypt.hash(randomPassword, 10, (err, hash) => {
        var user = new User(null, firstName, lastName, username, email, null, null, null, hash, profile_pic, datetime.toString());
        authDB.signUp(user, (error, result) => {
            if (error) {
                if (error.errno == 1062) {
                    respond.json("An account has already been registered with this email. Please login")
                }
                else {
                    respond.json(error);
                }
            }
            else {
                var userid = result.insertId
                authDB.signupSocial(facebookID, provider,userid, function (error, result) {
                    if (error) {
                        respond.json(error);
                    }
                    else {
                        authDB.activateAccount(userid, function (error, result) {
                            if (error) {
                                respond.json(error)
                            }
                            else {
                                socialsDB.facebookConnected(userid, function(error, result){
                                    if(error){
                                        respond.json(error)
                                    }
                                    else{
                                        respond.json("signed up with Facebook successfully")
                                    }
                                })  
                            }
                        })
                    }
                });
            }
        });
    });
}

// sign up 2FA
function twofaSignUp(request, respond) {
    var userid = request.userid
    // issue secret key to user. 
    const temp_secret = speakeasy.generateSecret();
    // Returns an object with secret.ascii, secret.hex, and secret.base32.
    // Also returns secret.otpauth_url, which we'll use later.
    QRCode.toDataURL(temp_secret.otpauth_url, function (err, data_url) {
        // Display this data URL to the user in an <img> tag
        // secret key and store in db
        authDB.addTempSecret(userid, temp_secret.base32, function (error, result) {
            if (error) {
                respond.json(error);
            }
            else {
                // display qr code to add
                respond.json(data_url)
            }
        });
    });
}

// confirm temp secret
function secretConfirm(request, respond) {
    var userid = request.userid
    var token = request.body.token
    authDB.twofaSecretTemp(userid, function (error, result) {
        if (error) {
            respond.json(error)
        }
        else if (result.length == 0) {
            respond.json("does not exists")
        }
        else {
            var secret = result[0].temp_secret
            console.log(token)
            const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 })
            // verified temp secret
            if (verified == true) {
                // remove temp secret from table
                authDB.removeSecretTemp(userid, function (error, result) {
                    if (error) {
                        respond.json(error)
                    }
                    else {
                        // add secret into table
                        authDB.twoFA(userid, secret, function (error, result) {
                            if (error) {
                                respond.json(error)
                            }
                            else {
                                // update user twoFA status
                                authDB.twoFaUserUpdate(userid, function (error, result) {
                                    if (error) {
                                        respond.json(error)
                                    }
                                    else {
                                        respond.json("success")
                                    }
                                })
                            }
                        })
                    }
                });
            }
            else {
                respond.json(verified)
            }
        }
    });
}

function removeTempSecret(request, respond) {
    authDB.removeSecretTemp(request.userid, function (error, result) {
        if (error) {
            respond.json(error)
        }
        else {
            respond.json('deleted')
        }
    });
}

// authenticating 2fa key when login
function twoFA(request, respond) {
    var key = request.body.token
    var token = request.body.key

    jwt.verify(key, process.env.TWOFA_KEY, (error, decoded) => {
        if (error) respond.status(401).json(error);

        else {
            var userid = decoded.userid
            authDB.twofaSecret(userid, function (error, result) {
                if (error) {
                    respond.json(error)
                }
                else if (result.length == 0) {
                    respond.json("does not exists")
                }
                else {
                    var secret = result[0].secret
                    console.log(secret)
                    console.log(token)
                    const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 })
                    if (verified == true) {
                        // if verified send access and refresh token
                        const accessToken = jwt.sign({ userid: userid }, process.env.SECRET_KEY, { expiresIn: '0.5h' })
                        const refreshToken = jwt.sign({ userid: userid }, process.env.SECRET_KEY2, { expiresIn: '7d' })
                        authDB.whitelistToken(refreshToken, jwt_decode(refreshToken).exp, (error, result) => {
                            if (error) respond.json(error)
                            else respond.json({ twoFA: verified, accessToken: accessToken, refreshToken: refreshToken })
                        })
                    }
                    else {
                        respond.json(verified)
                    }
                }
            });
        }
    });
}

// if user want to remove 2FA
function removetwoFA(request, respond) {
    var userid = request.userid
    authDB.removetwoFA(userid, function (error, result) {
        if (error) {
            respond.json(error)
        }
        else {
            authDB.twoFaUserDeleteUpdate(userid, function(error, result){
                if(error){
                    respond.json(error)
                }
                else{
                    respond.json("removed")
                }
            })
        }
    })
}

module.exports = { authUser, facebookSignUp, removeTempSecret, facebookLogin, usernameCheck, checkEmail, twofaSignUp, secretConfirm, twoFA, removetwoFA, googleLogin, googleSignUp, signUp, activateAccount, generateAccessToken, logout, forgetPasswordEmail, resetPasswordToken };