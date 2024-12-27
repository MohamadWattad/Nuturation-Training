const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Cart = require('./Cart');  // Import Cart model

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // must 
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordResetToken: {
        type: String, // Stores the hashed reset token
        default: null,
    },
    passwordResetExpires: {
        type: Date, // Stores the expiration date/time of the reset token
        default: null,
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the Cart model
        ref: 'Cart',  // This links to the Cart model
        default: null
    },
});

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }   
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    });
});

userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false);
            }
            resolve(true);
        });
    });
}

mongoose.model('User', userSchema);
