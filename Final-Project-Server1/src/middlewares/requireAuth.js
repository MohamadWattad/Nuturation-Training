const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' });
    }

    const token = authorization.replace('Bearer ', '');

    jwt.verify(token, 'My_Secret_Key', async (err, payload) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            return res.status(401).send({ error: 'You must be logged in.' });
        }

        const { userId } = payload;

        try {
            const user = await User.findById(userId);
            if (!user) {
                console.error('User not found for ID:', userId);
                return res.status(404).send({ error: 'User not found.' });
            }

            // Log the authenticated user for debugging
            console.log('Authenticated User:', user);

            // Attach the user object and userId to the request
            req.user = user; // Full user object
            req.user_id = userId; // Just the user ID
            next();
        } catch (error) {
            console.error('Error fetching user:', error.message);
            return res.status(500).send({ error: 'Failed to authenticate user.' });
        }
    });
};
