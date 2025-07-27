const express = require('express');
const router = express.Router();
const { generateComponent } = require('../controllers/aiController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.post('/generate', isAuthenticated, generateComponent);

module.exports = router;
