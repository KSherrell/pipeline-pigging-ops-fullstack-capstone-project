"use strict";

const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({

    RCName: {
        type: String,
        required: false
    },
    RCNumber: {
        type: Integer,
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
    receiverName: {
        type: String,
        required: false
    },
    pipelineSize: {
        type: String,
        required: false
    },
    product: {
        type: String,
        required: false
    },
    acceptablePigs: {
        type: String,
        required: false
    },
    closure: {
        type: String,
        required: false
    },
    piggingFrequency: {
        type: String,
        required: false
    },
    dateAdded: {
        type: Timestamp,
        required: false
    },
    pipelineActive: {
        type: Boolean,
        required: false
    },

});

const Pipeline = mongoose.model('Pipeline', pipelineSchema);
module.exports = Pipeline;
