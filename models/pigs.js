"use strict";

const mongoose = require('mongoose');

const pigSchema = new mongoose.Schema({

    pigType: {
        type: String,
        required: false
    },
    pigSize: {
        type: String,
        required: false
    }

});

const Pig = mongoose.model('Pig', pigSchema);
module.exports = Pig;
