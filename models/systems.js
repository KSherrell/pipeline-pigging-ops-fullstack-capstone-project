"use strict";

const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema({

    rcName: {
        type: String,
        required: false
    },
    systemName: {
        type: String,
        required: false
    }

});


const System = mongoose.model('System', systemSchema);

module.exports = System;
