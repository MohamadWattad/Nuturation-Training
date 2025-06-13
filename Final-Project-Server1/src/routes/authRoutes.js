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
const WorkoutPlan = require('../models/WorkoutPlan');
const accountSid = 'AC9f94db0b2b1a2c27f7e1fc214637fae6'; // Replace with your Twilio Account SID
const authToken = 'a047bdbfad9b7d3b567d2829a114dd48'; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);
const Recipeee = require('../models/Recipee');

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
        return res.status(400).json({ error: 'Must provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    try {
        console.log("Entered Password (from user):", password);
        console.log("Stored Hashed Password (from DB):", user.password);

        // 🔹 Compare Entered Password with Hashed Password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch); // This will print true or false

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, 'My_Secret_Key', { expiresIn: '7d' });

        res.json({ token, message: 'Login successful' });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: 'Internal server error' });
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
            role: user.role,
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
//Post videos (training)
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

router.get('/video', async (req, res) => {
    try {
        const { muscleGroup } = req.query; // Extract query parameter
        if (!muscleGroup) {
            return res.status(400).send({ error: 'Muscle group is required to fetch videos.' });
        }

        const videos = await Video.find({ muscleGroup: muscleGroup.trim() });

        if (videos.length === 0) {
            return res.status(404).send({ error: `No videos found for ${muscleGroup} muscle group.` });
        }

        res.status(200).send({ message: `${muscleGroup} videos fetched successfully`, videos });
    } catch (err) {
        console.error('Error fetching videos:', err.message);
        res.status(500).send({ error: 'Failed to fetch videos', details: err.message });
    }
});

router.delete('/video', async (req, res) => {
    try {
        const { title } = req.body; // Extract title from the request body
        console.log('Title received:', title); // Debug log

        if (!title) {
            return res.status(400).send({ error: 'Video title is required' });
        }

        // Find and delete the video by title
        const deletedVideo = await Video.findOneAndDelete({ title });
        if (!deletedVideo) {
            return res.status(404).send({ error: `Video with title "${title}" not found` });
        }

        res.status(200).send({ 
            message: `Video titled "${title}" deleted successfully`, 
            video: deletedVideo 
        });
    } catch (error) {
        console.error('Error deleting video:', error.message);
        res.status(500).send({ error: 'Failed to delete video' });
    }
});

//Post video trining for user (user is choosing the video he want to train not admin post videos for training)
router.post('/Workout-Plan', requireAuth, async (req, res) => {
    try {
      const userId = req.user_id;
      const { exerciseIds } = req.body;
  
      if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
        return res.status(400).send({ error: 'No exercise provided' });
      }
  
      // 🔍 Check if user already has a plan
      let existingPlan = await WorkoutPlan.findOne({ userId });
  
      if (!existingPlan) {
        // 🆕 No plan yet → create new
        existingPlan = new WorkoutPlan({
          userId,
          exercises: exerciseIds,
        });
      } else {
        // ✅ Filter out already-added exercises
        const currentIds = existingPlan.exercises.map(id => id.toString());
        const newExercises = exerciseIds.filter(id => !currentIds.includes(id));
  
        if (newExercises.length === 0) {
          return res.status(409).send({ message: "Exercise already added." });
        }
  
        // 🧩 Add only the new ones
        existingPlan.exercises.push(...newExercises);
      }
  
      await existingPlan.save();
  
      const populatedPlan = await WorkoutPlan.findById(existingPlan._id).populate('exercises');
  
      res.status(201).send({
        message: "Exercise added successfully",
        plan: populatedPlan,
      });
  
    } catch (err) {
      console.error("Error saving workout plan:", err.message);
      res.status(500).send({ error: "Failed to save workout plan" });
    }
  });
  

//get the list of exercises that user choosed for training ( not exercises that admin add to the workout page)
router.get('/getWorkout-Plan',requireAuth,async(req,res)=>{
    try{
        const userId = req.user_id;
        const workotPlan = await WorkoutPlan.find({userId}).populate("exercises");
        
        if(workotPlan.length === 0){
            res.status(404).send({message:"No workout plans found for this user."});
        }
        
        res.status(200).send({plans:workotPlan});
    }catch (err) {
        console.error("Error fetching workout plans:", err.message);
        res.status(500).send({ error: "Failed to fetch workout plans" });
      }
})
// delete exercise from the list that user make for exercises
router.delete('/deleteExercise' , requireAuth, async(req,res) => {
    try{
        const userId = req.user_id;
        const { exerciseId } = req.body;
        if (!exerciseId) {
            return res.status(400).send({ error: "Exercise ID is required." });
          }
        const plan = await WorkoutPlan.findOne({userId});
        if (!plan) {
            return res.status(404).send({ error: "Workout plan not found." });
          }
          plan.exercises = plan.exercises.filter(
            (id) => id.toString() !== exerciseId
          );
      
          await plan.save();
      
          const updatedPlan = await WorkoutPlan.findOne({ userId }).populate("exercises");
      
          res.status(200).send({
            message: "Exercise deleted successfully",
            plan: updatedPlan,
          });
        } catch (err) {
          console.error("Error deleting exercise:", err.message);
          res.status(500).send({ error: "Failed to delete exercise." });
        }
    }
)

//Adding meals for the Page (Page have meals)
router.post('/recipes',requireAuth,async(req,res)=>{
    try{
        const {title , image ,calories , carbs , fat , protein ,ingredients,category } = req.body;

        if(!title || !image || !calories || !carbs || !fat || !protein ||!ingredients){
            return res.status(400).send({ error: 'All fields are required.' });
        }
        const recipe = new Recipeee({
            title,
            image,
            calories,
            carbs,
            fat,
            protein,
            ingredients,
            category,
        })
        await recipe.save();
        res.status(201).send({ message: 'Recipe created successfully!', recipe });
    }catch (err) {
        console.error("Error saving recipe:", err.message);
        res.status(500).send({ error: 'Failed to create recipe' });
    }
});
//Get the meals (Page for meals)
router.get('/recipes' , requireAuth , async(req,res) => {
    try{
        const recipes = await Recipeee.find({});
        res.status(200).send(recipes);
    }catch(err){
        console.error("Error fetching recipes:", err.message);
        res.status(500).send({ error: "Failed to fetch recipes." });
    }
});

//delete meals (delete meal from the page of meals)
router.delete('/recipes' , requireAuth , async(req,res)=>{
    try{
        const {title} = req.body;
        if(!title) {
            res.status(400).send({error:"Recipe title is required."})
        }
        const deleted = await Recipeee.findOneAndDelete({title});

        if(!deleted){
            return res.status(404).send({ error: "Recipe not found" });
        }
        res.status(200).send({ message: "Recipe deleted successfully", deleted });
    }catch (err) {
        console.error("Error deleting recipe:", err.message);
        res.status(500).send({ error: "Failed to delete recipe" });
      }
});

// Get Cart
// router.get('/cart', requireAuth, async (req, res) => {
//   try {
//     const { productName } = req.query;
//     const cart = await Cart.findOne({ userId: req.user._id });

//     if (!cart || cart.products.length === 0) {
//       return res.status(200).send({
//         message: 'Your cart is empty',
//         products: [],
//         totalPrice: 0
//       });
//     }

//     let products = cart.products;

//     // Filter by name if provided
//     if (productName) {
//       products = products.filter(product =>
//         product.name.toLowerCase().includes(productName.toLowerCase())
//       );

//       if (products.length === 0) {
//         return res.status(404).send({
//           message: `No products found in the cart with the name: ${productName}`,
//         });
//       }
//     }

//     // Calculate total per item and overall total
//     let totalPrice = 0;
//     const updatedProducts = products.map(product => {
//       const itemTotal = product.price * product.quantity;
//       totalPrice += itemTotal;

//       return {
//         ...product._doc, // keep _id, name, price, quantity, image
//         total: itemTotal
//       };
//     });

//     res.status(200).send({
//       message: 'Cart retrieved successfully',
//       products: updatedProducts,
//       totalPrice: totalPrice
//     });

//   } catch (err) {
//     console.error('Error fetching cart items:', err.message);
//     res.status(500).send({ error: 'Failed to fetch cart items' });
//   }
// });
// router.get('/cart', requireAuth, async (req, res) => {
//   try {
//     const { productName } = req.query;

//     // Populate products from Product collection
//     const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');

//     if (!cart || cart.products.length === 0) {
//       return res.status(200).send({
//         message: 'Your cart is empty',
//         products: [],
//         totalPrice: 0
//       });
//     }

//     let products = cart.products;

//     // Filter by product name if query is passed
//     if (productName) {
//       products = products.filter(item =>
//         item.productId.name.toLowerCase().includes(productName.toLowerCase())
//       );

//       if (products.length === 0) {
//         return res.status(404).send({
//           message: `No products found in the cart with the name: ${productName}`
//         });
//       }
//     }

//     let totalPrice = 0;

//     // Build response array
//     const updatedProducts = products.map(item => {
//       const product = item.productId;
//       const itemTotal = product.price * item.quantity;
//       totalPrice += itemTotal;

//       return {
//         _id: product._id,
//         name: product.name,
//         image: product.image,
//         price: product.price,
//         quantity: item.quantity,
//         total: itemTotal
//       };
//     });

//     res.status(200).send({
//       message: 'Cart retrieved successfully',
//       products: updatedProducts,
//       totalPrice: totalPrice
//     });
//   } catch (err) {
//     console.error('Error fetching cart items:', err.message);
//     res.status(500).send({ error: 'Failed to fetch cart items' });
//   }
// });
router.get('/cart', requireAuth, async (req, res) => {
    try {
      const { productName } = req.query;
      const cart = await Cart.findOne({ userId: req.user._id });
  
      if (!cart || cart.products.length === 0) {
        return res.status(200).send({
          message: 'Your cart is empty',
          products: [],
          totalPrice: 0
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
  
      let totalPrice = 0;
  
      const updatedProducts = products.map(product => {
        const itemTotal = product.price * product.quantity;
        totalPrice += itemTotal;
  
        return {
          ...product._doc,
          total: itemTotal
        };
      });
  
      res.status(200).send({
        message: 'Cart retrieved successfully',
        products: updatedProducts,
        totalPrice
      });
    } catch (err) {
      console.error('Error fetching cart items:', err);
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
  
      if (product.stock <= 0) {
        return res.status(400).send({ error: 'Out of stock' });
      }
  
      let cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = new Cart({ userId: req.user._id, products: [] });
      }
  
      const existingProduct = cart.products.find(p => p.name === product.name);
  
      if (existingProduct) {
        existingProduct.quantity += 1;
  
        // ✅ Ensure price is set (fix for old cart items)
        if (!existingProduct.price) {
          existingProduct.price = product.price;
        }
      } else {
        cart.products.push({
          name: product.name,
          image: product.image,
          price: product.price,  // ✅ Add price when inserting
          quantity: 1,
        });
      }
  
      // Update product stock
      product.stock -= 1;
      await product.save();
  
      await cart.save();
  
      res.status(200).send({
        message: 'Product added to cart successfully',
        cart,
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).send({ error: 'Failed to add product to cart' });
    }
  });
  
// router.post('/add-to-cart', requireAuth, async (req, res) => {
//     const { productName } = req.body;
//     try {
//         const product = await Products.findOne({ name: productName });
//         if (!product) {
//             return res.status(404).send({ error: 'Product not found' });
//         }
//         if (product.stock <= 0) {
//             return res.status(400).send({ error: 'Out of stock' });
//         }

//         let cart = await Cart.findOne({ userId: req.user._id });
//         if (!cart) {
//             cart = new Cart({ userId: req.user._id, products: [] });
//         }
//         const existingProduct = cart.products.find((p) => p.name === product.name);
//         if (existingProduct) {
//             existingProduct.quantity += 1;
//         } else {
//             cart.products.push({
//                 name: product.name,
//                 image: product.image,
//                 price:product.price,
//                 quantity: 1,
//             });
//         }
//         product.stock -= 1;
//         await product.save();
//         await cart.save();
//         res.status(200).send({ message: 'Product added to cart successfully', cart });
//     } catch (error) {
//         console.error('Error adding product to cart:', error.message);
//         res.status(500).send({ error: 'Failed to add product to cart' });
//     }
// });

//update the amount of the product
router.put('/update-stock', requireAuth , async(req,res) => {
    const {productName , stockToAdd} = req.body;
    try{
        const product = await Products.findOne({name : productName});
        if (!product){
            return res.status(400).send({error :'Product not found'});
        }
        product.stock += stockToAdd ;
        await product.save();
        res.status(200).send({ message: `Stock updated successfully. New stock: ${product.stock}`, product });

    }catch(error){
        console.error('Error updating stock:', error.message);
        res.status(500).send({ error: 'Failed to update stock' });
    }
})
//Decrease from the amount of the product

router.put('/decrease-stock', requireAuth , async(req,res)=> {
    const {productName , stockToRemove} = req.body;
    
    try{
        const product = await Products.findOne({name:productName});

        if(!product) {
            return res.status(404).send({error:'Product not found'});
        }
        if (product.stock < stockToRemove) {
            return res.status(400).send({ error: 'Not enough stock available' });
        }
        product.stock -= stockToRemove ;
        await product.save();
        res.status(200).send({message:`Stock removed successfully. New stock: ${product.stock}`, product})
    }catch(error){
        console.error('Error removing from stock' , error.message);
        res.status(500).send({error:'Faild remove from the stock'});
    }
})




//clear the cart after payment
router.delete('/clear-cart' , requireAuth , async(req,res)=>{
    try{
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).send({ error: "Cart is empty !" });
        }
        cart.products = [];
        await cart.save();
        res.status(200).send({ message: "Cart cleared successfully" });

    }catch (error) {
        console.error("Error clearing cart:", error.message);
        res.status(500).send({ error: "Failed to clear cart" });
    }
})

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abotalebwattad@gmail.com',
        pass: 'jqfn uelc gttl makx',
    },
});

// Reset Password
router.post('/resetpassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const tempPassword = generatePassword();
        console.log("Generated Temporary Password (sent to email):", tempPassword);

        user.password = tempPassword;
        await user.save(); // The pre('save') hook will automatically hash the password
        console.log("Password Updated in DB Successfully!");

        // 🔹 Retrieve Updated Password to Verify Hashing
        const verifyUser = await User.findOne({ email });
        console.log("Stored Hashed Password in DB (After Save):", verifyUser.password);

        // 🔹 Send Email with New Password
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Notification',
            text: `Your password is: ${tempPassword}. Please log in with your new password.`,
        });

        res.status(200).json({ message: 'Password reset successfully. Check your email for the new password.' });

    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).json({ error: 'Failed to reset password. Please try again later.' });
    }
});


module.exports = router;
