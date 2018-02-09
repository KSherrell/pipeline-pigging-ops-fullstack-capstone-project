"use strict";

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({

    operatorEmail: {
        type: String,
        required: false
    },
    activityDate: {
        type: String,
        required: false
    },
    activityTime: {
        type: String,
        required: false
    },
    systemName: {
        type: String,
        required: false
    },
    pipelineName: {
        type: String,
        required: false
    },
    launcherName: {
        type: String,
        required: false
    },
    pigType: {
        type: String,
        required: false
    },
    sandWeight: {
        type: Number,
        required: false
    },
    paraffinWeight: {
        type: Number,
        required: false
    },
    exception: {
        type: String,
        required: false
    },

    notes: {
        type: String,
        required: false
    },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
