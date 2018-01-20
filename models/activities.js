"use strict";

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({

    pipelineName: {
        type: String,
        required: false
    },
    exception: {
        type: String,
        required: false
    },
    operatorEmail: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    launchTime: {
        type: Timestamp,
        required: false
    },
    receiveTime: {
        type: String,
        required: false
    },
    launcherName: {
        type: String,
        required: false
    },
    receiverName: {
        type: String,
        required: false
    },
    pigType: {
        type: String,
        required: false
    },
    debrisType: {
        type: String,
        required: false
    },
    debrisWeight: {
        type: String,
        required: false
    },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
