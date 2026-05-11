const urlModel = require('../models/UrlModel.js');
const { customAlphabet } = require('nanoid');
const { isValidUrl, isValidShortCode } = require('../validator/validation.js');
const redisClient = require('../redisConfig.js');


// Generate shortURL for longURL:
const createShortURL = async function (req, res) {
    try {
        const longURL = req.body.longURL;
        if (!longURL) {
            return res.status(400).send({ status: false, message: " Invalid URL. Please provide a URL." });

        }

        if (!isValidUrl(longURL)) {
            return res.status(400).send({ status: false, message: " Invalid URL format. Please provide a valid URL " })
        }

        // Generate shortCode of size 8 by using base 62 characters(0-9,A-Z,a-z)
        const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const nanoid = customAlphabet(alphabet, 8)
        const shortCode = nanoid()

        // Append baseURL with the unique generated shortCode to generate shortURL
        const shortURL = `${process.env.BASE_URL}/${shortCode}`;

        const newURL = {
            longURL: longURL,
            shortCode: shortCode,
            urlClickcount: 0
        };

        // Save the document in MongoDB
        await urlModel.create(newURL);

        return res.status(201).send({ status: true, message: "ShortUrl generated", data: shortURL })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


// Redirect user to longURL of provided shortURL:
const redirectUrl = async function (req, res) {
    try {
        const shortCode = req.params.shortCode;

        if (!isValidShortCode(shortCode)) {
            return res.status(400).send({
                status: false, message:
                    " Invalid shortURL format. Please provide a valid shortURL "
            });
        }

        // If longURL is found in Redis, use it and increment the click count in Redis as well in mongodb
        let isexistUrl = await redisClient.get(shortCode);
        if (isexistUrl) {
            let parseUrl = JSON.parse(isexistUrl)
            parseUrl.urlClickcount++;
            await redisClient.set(shortCode, JSON.stringify(parseUrl), {
                EX: 3600
            })

            await urlModel.findOneAndUpdate({ shortCode: shortCode }, { $inc: { urlClickcount: 1 } })
            console.log("cache hit")
            return res.status(301).redirect(parseUrl.longURL)
        }

        // If not found in Redis, fetch from MongoDB and update click count
        const isValidshortUrl = await urlModel.findOneAndUpdate({ shortCode: shortCode },
            { $inc: { urlClickcount: 1 } },
            { new: true }).select('longURL urlClickcount');

        if (!isValidshortUrl) {
            // null is falsy in JavaScript
            // so !null = true → enters this block
            return res.status(404).send({ status: false, message: "Short URL not found." });
        }

        // Store in redis database for future access
        const redisData = {
            longURL: isValidshortUrl.longURL,
            urlClickcount: isValidshortUrl.urlClickcount
        }

        await redisClient.set(shortCode, JSON.stringify(redisData), {
            EX: 3600
        })

        console.log("cache miss")
        return res.status(301).redirect(isValidshortUrl.longURL)

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


// Combined click tracker API:
const handleClick = async function (req, res) {
    try {
        const shortCode = req.params.shortCode;

        if (!isValidShortCode(shortCode)) {
            return res.status(400).send({
                status: false, message: "Invalid shortURL format. Please provide a valid shortURL." });
        }

        // Fetch clickCount from Redis database
        const isExistUrl = await redisClient.get(shortCode);
            if (isExistUrl) {
                let parseUrl = JSON.parse(isExistUrl);
                return res.status(200).send({ status: true, message: "total clicks",
                     totalClicks: parseUrl.urlClickcount })
            }

            // If not in Redis, fetch from MongoDB
            const isValidShortUrl = await urlModel.findOne({ shortCode: shortCode })
            .select('longURL urlClickcount');

            if (!isValidShortUrl) {
                return res.status(404).send({ status: false, message: "Short URL not found." });
            }

            // Store in redis database for future access
            const redisData = {
                longURL: isValidShortUrl.longURL,
                urlClickcount: isValidShortUrl.urlClickcount
            };
            
            await redisClient.set(shortCode, JSON.stringify(redisData),{
                EX:3600
            });


            return res.status(200).send({ status: true, message: "total clicks", totalClicks:
                 isValidShortUrl.urlClickcount })

        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    }

module.exports = { createShortURL, redirectUrl, handleClick }


