const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'to short product title'],
        maxlength: [100, 'to long product title']
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [20, 'to short Product description'],

    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
    },
    sold: {
        type: Number,
        deafult: 0,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        max: [200000, 'Too Long Product Price'],

    },
    priceAfterDiscount: {
        type: Number,
    },

    colors: [String],
    imageCover: {
        type: String,
        requireD: [true, 'Image Cover is required'],
    },
    images: [String],

    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must belong to category']
    },

    subcategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
    }, ],

    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Ratung must be bleow or equal 5.0 '],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true,
    // to enable virtual populate
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
});

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
})


// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name -_id'
    });
    next();
});

const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageCoverUrl;
    }
    if (doc.images) {
        const imagesList = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`
            imagesList.push(imageUrl)
        })
        doc.images = imagesList;
    }

}
productSchema.post('init', (doc) => {
    setImageUrl(doc);
});

productSchema.post('save', (doc) => {
    setImageUrl(doc);
})

const ProductModel = mongoose.model('Product', productSchema);


module.exports = ProductModel;