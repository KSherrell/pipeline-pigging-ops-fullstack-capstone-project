"use strict";

const debrisSchema = new mongoose.Schema({

    pipelineName: {
        type: String,
        required: false
    },
    receiverName: {
        type: String,
        required: false

    },
    debrisType: {
        type: String,
        required: false
    },
    debrisWeight: {
        type: integer,
        required: false
    }
});

const Debris = mongoose.model('Debris', debrisSchema);
module.exports = Debris;
