const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');

const { createShortURL, redirectUrl, handleClick} = require('../controllers/urlController.js');

// Route to generate a unique short URL for a given long URL
router.post('/generateShorturl', rateLimiter, createShortURL);

// Route to get the total number of clicks for a given short URL
router.get('/trackClicks/:shortCode', rateLimiter, handleClick);


// Route to redirect the user to the long URL associated with the provided short code
router.get('/:shortCode', rateLimiter, redirectUrl);

module.exports = router;
