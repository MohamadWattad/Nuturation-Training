const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Product must have a name
    },
    description: {
        type: String, // Optional field for product details
    },
    price: {
        type: Number,
        required: true, // Product must have a price
    },
    image: {
        type: String, // URL to product image
    },
    stock: {
        type: Number,
        default: 0, // Default stock is 0
    },
    category: {
        type: String, // Optional: For categorizing products
    },
});

module.exports = mongoose.model('Product', productSchema);
