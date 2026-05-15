// Generates a blueprint for all the APIs defined in the router files
// 'swagger-ui-express' renders the visual interface from that blueprint
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener API',
            version: '1.0.0',
            description: 'API documentation for URL Shortener application'
        },
        servers: [
            {
                url: process.env.BASE_URL
            }
        ]
    },
    apis: ['./router/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;