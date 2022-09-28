const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/ErrorMiddleWare')
const mountRoutes = require('./routes');

dotenv.config({
    path: 'config.env'  
});
const dbConnection = require('./Config/database');
const {
    webhookCheckout
} = require('./services/orderService');
// Connect database
dbConnection();

// express app
const app = express();

// Enable other domain to access your app 
app.use(cors());
app.options('*', cors());

// Compress All respone
app.use(compression())

// checkout webhook
app.use('/webhook-checkout', express.raw({
    type: 'application/json'
}), webhookCheckout)

// MiddleWare
app.use(express.json({
    limit: '20kb'
}))


// מאפשר פתיחה תמונה 
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV} `);
}


// To apply data sanitization
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many accounts created from this IP, please try again after an hour',

})

// Apply the rate limiting middleware to all requests
app.use("/api", limiter)

// middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({
    whitelist: ['price', 'sold', 'quantity', 'ratingsAverage', 'ratingsQuantity']
}));

// if (process.env.NODE_ENV === 'production') {
//     app.use(morgan('prod'))
//     console.log(`mode:${process.env.NODE_ENV}`);
// }
//Mount Route
// Mount Routes
mountRoutes(app)
app.use('*', (req, res, next) => {

    next(new ApiError(`Cant Find this Route: ${req.originalUrl}`, 400));
})


// Global eroor handling middleware
app.use(globalError);


const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
    console.log(`App running on Port ${PORT}`);
})
//  Handle rejection outside express
process.on('unhandledRejection', (err) => {
    console.error(`UnhandleRjection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log('Shutting down... ');
        process.exit(1);
    });

})