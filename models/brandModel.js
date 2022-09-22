const mongoose = require('mongoose');
// 1- Create Schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category required'],
        unique: [true, 'category must be unique'],
        minlength: [3, 'too short category name'],
        maxlength: [32, 'too long category name']
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
}, {
    timestamps: true
});
const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
}

// getOne,getAll,update 'we set the image url'
brandSchema.post('init', (doc) => {
    setImageUrl(doc)
});
// create
brandSchema.post('save', (doc) => {
    setImageUrl(doc)
})
//  2- Create Model 
const brandModel = mongoose.model('Brand', brandSchema);


module.exports = brandModel;