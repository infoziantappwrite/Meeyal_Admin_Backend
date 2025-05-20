const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    imagesUrl: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
})

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;