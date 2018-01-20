"use strict";

const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema({
    systemName: {
        type: String,
        required: false
    }

});


const System = mongoose.model('System', systemSchema);

module.exports = System;
