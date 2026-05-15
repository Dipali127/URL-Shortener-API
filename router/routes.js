const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');

const { createShortURL, redirectUrl, handleClick} = require('../controllers/urlController.js');

/**
 * @swagger
 * /generateShorturl:
 *   post:
 *     summary: Generate a short URL
 *     description: Generates a short URL from the provided long URL and saves it in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longURL:
 *                 type: string
 *                 example: "https://www.google.com"
 *               customShortcode:
 *                 type: string
 *                 example: "mylink"
 *     responses:
 *       201:
 *         description: Short URL generated successfully
 *       200:
 *         description: Long URL already exists
 *       400:
 *         description: Invalid URL format
 *       500:
 *         description: Internal server error
 */
router.post('/generateShorturl', rateLimiter, createShortURL);

/**
 * @swagger
 * /trackClicks/{shortCode}:
 *   get:
 *     summary: Track total clicks on a short URL
 *     description: Returns the total number of clicks for the provided short URL.
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         example: "0956Aq4"
 *     responses:
 *       200:
 *         description: Total clicks returned successfully
 *       400:
 *         description: Invalid short URL format
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Internal server error
 */
router.get('/trackClicks/:shortCode', rateLimiter, handleClick);

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original long URL
 *     description: Redirects the user to the original long URL associated with the provided short code.
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         example: "0956Aq4"
 *     responses:
 *       302:
 *         description: Redirects to the original long URL
 *       400:
 *         description: Invalid short URL format
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Internal server error
 */
router.get('/:shortCode', rateLimiter, redirectUrl);

module.exports = router;