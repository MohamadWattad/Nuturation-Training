const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const Cart = mongoose.model('Cart');
const bcrypt = require('bcrypt');
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const twilio = require('twilio');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Products = require('../models/Products');
const Video = require('../models/Video');

const accountSid = 'AC9f94db0b2b1a2c27f7e1fc214637fae6'; // Replace with your Twilio Account SID
const authToken = 'a047bdbfad9b7d3b567d2829a114dd48'; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);

const router = express.Router();

const generatePassword = () => {
    return crypto.randomBytes(8).toString('hex'); // Generates a 16-character random password
};

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, lastName, email, phone, password } = req.body;
    try {
        const user = new User({ name, lastName, email, phone, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'My_Secret_Key');
        res.send({ token });
    } catch (err) {
        return res.status(422).send(err.message); // 422: Invalid data
    }
});

// Signin Route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, 'My_Secret_Key');
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

// Get User Name
router.get('/getname', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send({
            name: user.name,
            lastName: user.lastName,
        });
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        res.status(500).send({ error: 'Failed to fetch user data' });
    }
});

// Add Product Route
router.post('/products', async (req, res) => {
    try {
        const { name, description, price, image, stock, category } = req.body;
        if (!name || !price) {
            return res.status(400).send({ error: 'Name and price are required' });
        }
        const newProduct = new Product({ name, description, price, image, stock, category });
        await newProduct.save();
        res.status(201).send({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        console.error('Error creating product:', err.message);
        res.status(500).send({ error: 'Failed to create product' });
    }
});

// Get All Products
router.get('/products', requireAuth, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send({ error: 'Failed to fetch products' });
    }
});

// Delete Product
router.delete('/products', requireAuth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Product name is required' });
        }
        const deletedProduct = await Product.findOneAndDelete({ name });
        if (!deletedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).send({ error: 'Failed to delete product' });
    }
});
router.post('/video', async (req, res) => {
    try {
        const { title, gifUrl, muscleGroup, description, duration } = req.body;
        if (!title || !gifUrl || !muscleGroup) {
            return res.status(400).send({ error: "title, gifUrl, and muscleGroup are required" });
        }
        const video = new Video({
            title,
            gifUrl,
            muscleGroup,
            description,
            duration,
        });
        await video.save();
        res.status(201).send({ message: 'Video added successfully', video });
    } catch (err) {
        console.error('Error adding video:', err.message);
        res.status(500).send({ error: 'Failed to add video', details: err.message });
    }
}); 

// Get Cart
router.get('/cart', requireAuth, async (req, res) => {
    try {
        const { productName } = req.query;
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart || cart.products.length === 0) {
            return res.status(200).send({
                message: 'Your cart is empty',
                products: [],
            });
        }

        let products = cart.products;
        if (productName) {
            products = products.filter((product) =>
                product.name.toLowerCase().includes(productName.toLowerCase())
            );

            if (products.length === 0) {
                return res.status(404).send({
                    message: `No products found in the cart with the name: ${productName}`,
                });
            }
        }

        res.status(200).send({
            message: 'Cart retrieved successfully',
            products,
        });
    } catch (err) {
        console.error('Error fetching cart items:', err.message);
        res.status(500).send({ error: 'Failed to fetch cart items' });
    }
});

// Add to Cart
router.post('/add-to-cart', requireAuth, async (req, res) => {
    const { productName } = req.body;
    try {
        const product = await Products.findOne({ name: productName });
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, products: [] });
        }
        const existingProduct = cart.products.find((p) => p.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({
                name: product.name,
                image: product.image,
                quantity: 1,
            });
        }
        await cart.save();
        res.status(200).send({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        res.status(500).send({ error: 'Failed to add product to cart' });
    }
});

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nutri_fit360@hotmail.com',
        pass: 'm7mdgoro159852',
    },
});

// Reset Password
router.post('/resetpassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const tempPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        user.password = hashedPassword;
        await user.save();
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Notification',
            text: `Your temporary password is: ${tempPassword}. Please change it after logging in.`,
        });
        res.status(200).send({ message: 'Password reset successfully. Check your email for the new password.' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).send({ error: 'Failed to reset password' });
    }
});

module.exports = router;
