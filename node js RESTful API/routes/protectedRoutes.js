const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

// Protected route using checkAuth middleware
router.get('/protected-route', checkAuth, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
