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

// Imports swagger-ui-express to render the Swagger UI in the browser for all APIs.
const swaggerUi = require('swagger-ui-express');

// swaggerConfig reads the JSDoc Swagger comments from router files and converts them into an OpenAPI specification.
const swaggerSpec = require('./swaggerConfig');

// Sets up the /api-docs route to serve the Swagger UI, allowing users to view and test 
// all APIs directly from the browser based on the specification provided by swaggerSpec.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const route = require('./router/routes.js');
app.use('/', route);

app.listen(port, () => {
    console.log(`Server listen on the port ${port}`);
})


