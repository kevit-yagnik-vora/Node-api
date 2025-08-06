const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./api/routes/user');
const workspaceRoutes = require('./api/routes/workspace');
const contactRoutes = require('./api/routes/contact');
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/user', userRoutes);
app.use('/workspace', workspaceRoutes);
app.use('/contacts', contactRoutes)

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;