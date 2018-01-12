"use strict";

const User = require('./models/user');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const moment = require('moment');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
mongoose.Promise = global.Promise;

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server = undefined;

function runServer(urlToUse) {
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                console.log(`Listening on localhost:${config.PORT}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

// ---------------USER ENDPOINTS-------------------------------------
// POST -----------------------------------
// CREATE ACCOUNT (USER)
app.post('/users/create', (req, res) => {
    // the following variables should match the ones in the ajax call
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    email = email.trim();
    let password = req.body.password;
    password = password.trim();
    //create encryption key
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        //apply encryption key to current password
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            //using Mongoose schema to create new user based on above variables
            User.create({
                fname,
                lname,
                email,
                password: hash,
                approved: 0,
                role: ""
            }, (err, item) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                if (item) {
                    console.log(`User \`${email}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});

// LOGIN
app.post('/users/login', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    User
        .findOne({
            email: req.body.email
        }, function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                // bad username
                return res.status(401).json({
                    message: "User not found"
                });
            } else {
                items.validatePassword(req.body.password, function (err, isValid) {
                    if (err) {
                        console.log('There was an error validating the password.');
                    }
                    if (!isValid) {
                        return res.status(401).json({
                            message: "Not found"
                        });
                    } else {

                        return res.json(items);
                    }
                });
            };
        });
});


// RESET PASSWORD
app.get('/users/check-email/:email', function (req, res) {
    User
        .findOne({
            email: req.params.email
        }, function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                // bad email
                return res.status(401).json({
                    message: "User not found"
                });
            } else {
                return res.json(items);
            }
        });
});


// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
//app.use('*', (req, res) => {
//    res.status(404).json({
//        message: 'Not Found'
//    });
//});

exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;
