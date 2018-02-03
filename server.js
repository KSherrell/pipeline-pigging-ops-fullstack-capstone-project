"use strict";

const User = require('./models/user');
const Pipeline = require('./models/pipelines');
const Activity = require('./models/activities');
const Pig = require('./models/pigs');
const System = require('./models/systems');
const Debris = require('./models/debris');
const ReportCenter = require('./models/reportcenters');
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

//  ********** RUN/CLOSE SERVER **********

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

// **********  USER ENDPOINTS  **********

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

// GET USERs TO CHECK FOR ACCOUNT REQUESTS
app.get("/users/requests", function (req, res) {
    User
        .find(function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                return res.status(401).json({
                    message: "System not found"
                });
            } else {
                return res.json(items);
            }
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
                        message: "There was an error validating the password."
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


// check if users exist
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

// CHANGE PASSWORD
app.put('/users/reset-pwd/:userID', function (req, res) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        //apply encryption key to current password
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            User.findByIdAndUpdate(req.params.userID, {
                password: hash
            }).exec().then(function (achievement) {
                return res.status(204).end();
            }).catch(function (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            });
        });
    });
});

// CHANGE NAME AND EMAIL
app.put('/users/reset-name/:userID', function (req, res) {
    User.findByIdAndUpdate(req.params.userID, {
        email: req.body.email,
        fname: req.body.fname,
        lname: req.body.lname
    }).exec().then(function (achievement) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

// APPROVE/UPDATE USER
app.put('/users/update/:email', function (req, res) {
//    console.log(req.params.email);
//    console.log(req.body.role);
    User.findOneAndUpdate({
        email: req.params.email
    }, {
        role: req.body.role,
        approved: req.body.approved
    }).exec().then(function (achievement) {
        console.log(req.params.email)
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
})

app.post('/pipelines/create', (req, res) => {
    // the following variables should match the ones in the ajax call
    Pipeline
        .create({
            RCName: req.body.RCName,
            systemName: req.body.systemName,
            pipelineName: req.body.pipelineName,
            launcherName: req.body.launcherName,
            receiverName: req.body.receiverName,
            pipelineSize: req.body.pipelineSize,
            product: req.body.product,
            acceptablePigs: req.body.acceptablePigs,
            closure: req.body.closure,
            piggingFrequency: req.body.piggingFrequency,
            dateAdded: req.body.dateAdded,
            pipelineActive: req.body.pipelineActive
        }, (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            if (item) {
                console.log(`Pipeline \`${req.body.pipelineName}\` created.`);
                return res.json(item);
            }
        });
});


// Get list of RCs
app.get("/reportcenters", function (req, res) {
    ReportCenter
        .find(function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                return res.status(401).json({
                    message: "System not found"
                });
            } else {
                return res.json(items);
            }
        });
});

// Return a list of Systems based on RC selection
app.get("/systems/:rcValue", function (req, res) {
    System
        .find({
            RCName: req.params.rcValue,
        }, function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                return res.status(401).json({
                    message: "System not found"
                });
            } else {
                return res.json(items);
            }
        });
});


// Return a list of pipelines based on System selection
app.get("/pipelines/:systemValue", function (req, res) {
    Pipeline
        .find({
            systemName: req.params.systemValue,
        }, function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                return res.status(401).json({
                    message: "System not found"
                });
            } else {
                return res.json(items);
            }
        });

});

// Get a pipeline to update
app.get('/pipelines/update/:pipelineValue', function (req, res) {
    Pipeline
        .findOne({
                pipelineName: req.params.pipelineValue,
            },
            function (err, items) {
                if (err) {
                    return res.status(500).json({
                        message: "Internal server error"
                    });
                }
                if (!items) {
                    return res.status(401).json({
                        message: "System not found"
                    });
                } else {
                    return res.json(items);
                }
            });

});

// Update pipeline
app.put('/pipelines/update/:pipelineID', function (req, res) {
    Pipeline
        .findByIdAndUpdate(req.params.pipelineID, {
            pipelineName: req.body.pipelineName,
            launcherName: req.body.launcherName,
            receiverName: req.body.receiverName,
            pipelineSize: req.body.pipelineSize,
            product: req.body.product,
            acceptablePigs: req.body.acceptablePigs,
            closure: req.body.closure,
            piggingFrequency: req.body.piggingFrequency,
        }).exec().then(function (achievement) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

// Delete a pipeline
app.delete("/pipelines/delete/:pipelineID", function (req, res) {
    Pipeline
        .findByIdAndRemove(req.params.pipelineID,
            function (err, items) {
                if (err) {
                    return res.status(500).json({
                        message: "Internal server error"
                    });
                }
                if (!items) {
                    return res.status(401).json({
                        message: "System not found"
                    });
                } else {
                    return res.json(items);
                }
            });
});

// Get list of pipelines
app.get("/pipelines", function (req, res) {
    Pipeline
        .find(function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                return res.status(401).json({
                    message: "System not found"
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
