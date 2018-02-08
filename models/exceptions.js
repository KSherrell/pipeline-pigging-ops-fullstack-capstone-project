"use strict";

const mongoose = require('mongoose');

const exceptionSchema = new mongoose.Schema({

    exception: {
        type: String,
        required: false
    }
});

const Exception = mongoose.model('Exception', exceptionSchema);

module.exports = Exception;
