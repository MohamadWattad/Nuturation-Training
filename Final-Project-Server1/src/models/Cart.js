const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link cart to user
  products: [
    {
      name: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
