const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({

        name: {
            type: String,
            trim: true,
            required: [true, 'name is required']
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, 'name is required'],
            unique: true,
            lowercase: true,
        },
        phone: String,
        profileImg: String,

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Too short password'],
        },
        passwordChangedAt: Date,
        passwordRestCode: String,
        passwordRestExpires: Date,
        passwordRestVerified: Boolean,
        role: {
            type: String,
            enum: ['user', 'manager', 'admin'],
            default: 'user',
        },
        active: {
            type: Boolean,
            default: true,
        },
        // Child refernce (one to many)
        wishlist: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        }, ],
        addresses: [{
            id: {
                type: mongoose.Schema.Types.ObjectId},
                alias:String,
                details:String,
                phone:String,
                city:String,
                postalCode:String,
        }]
    },


    {
        timestamps: true
    })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;