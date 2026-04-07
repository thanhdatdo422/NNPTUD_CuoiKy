const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id)
        .select('-password')
        .populate({
          path: 'role',
          populate: { path: 'permissions' },
        });
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.name === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role && req.user.role.name === 'admin') {
      return next();
    }

    const userPermissions = req.user.role?.permissions || [];
    const hasPermission = userPermissions.some(
      (permission) => permission.name === requiredPermission
    );

    if (hasPermission) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
  };
};

module.exports = { protect, admin, checkPermission };