const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authmiddleware.js');
// Example protected route
router.get('/dashboard', protect, (req, res) => {
  res.json({
    message: 'Welcome to the protected dashboard!',
    user: req.user,
  });
});

module.exports = router;
