// Middleware to allow only users with 'creator' role
module.exports = function creatorOnly(req, res, next) {
  if (req.user && req.user.role === 'creator') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Creators only' });
};
