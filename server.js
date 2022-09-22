const path = require('path');
const cors = require('cors');
const compression = require('compression');
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
const { webhookCheckout } = require('./services/orderService');
// Connect database
dbConnection();

// express app
const app = express();

// Enable other domain to access your app 
app.use(cors());
app.options('*', cors());

// Compress All respone
app.use(compression( ))

// checkout webhook
app.use('/webhook-checkout', express.raw({
    type: 'application/json'
}),webhookCheckout)

// MiddleWare
app.use(express.json())


// מאפשר פתיחה תמונה 
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV} `);
}
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