// Load environment variables from .env file

const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const express = require('express');
const app = express();

// Middleware to handle JSON data in request body
app.use(express.json());

const port = process.env.PORT || 3001;

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(() => { console.log("mongoDB successfully connected") })
    .catch((error) => { console.log(error.message) });

const redisClient = require('./redisConfig.js');
redisClient.connect().then(() => { console.log("connected to redis") })
      .catch((error) => console.log(error.message))

const route = require('./router/routes.js');
app.use('/', route);

app.listen(port, () => {
    console.log(`Server listen on the port ${port}`);
})


