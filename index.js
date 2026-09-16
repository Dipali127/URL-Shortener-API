// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

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

// Imports the Swagger UI library to generate a user interface for the documented APIs/routes.
const swaggerUi = require('swagger-ui-express');

// swaggerConfig uses the swagger-jsdoc library to generate an OpenAPI specification by reading the 
// Swagger/OpenAPI documentation comments from the routes file.
const swaggerSpec = require('./swaggerConfig');

// Sets up the /api-docs route.
// swaggerUi.serve generates the Swagger UI's static files, and swaggerUi.setup(swaggerSpec)
// uses the OpenAPI specification stored in swaggerSpec to generate an interactive
// user interface for viewing and testing the APIs in the browser.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const route = require('./router/routes.js');
app.use('/', route);

app.listen(port, () => {
    console.log(`Server listen on the port ${port}`);
})


