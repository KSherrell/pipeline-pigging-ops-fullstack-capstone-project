"use strict";

const mongoose = require('mongoose');

const rcSchema = new mongoose.Schema({
    RCName: {
        type: String,
        required: false
    },

});


const ReportCenter = mongoose.model('ReportCenter', rcSchema);

module.exports = ReportCenter;
