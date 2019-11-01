const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImgSchema = new Schema({
    imageURL: {type: String, required: true},
    caption_img: {type: String, required: true},
    user: {type: String, required: true},
    proyect_name: {type: String, required: true},
    InGallery: {type: String, required: true}
}, 
{timestamps: true});

module.exports = mongoose.model('Img', ImgSchema);