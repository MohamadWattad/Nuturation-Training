const requireAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).send({ error: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = requireAdmin;
