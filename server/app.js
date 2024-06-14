const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config()
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/', require('./routes/index'));
app.use('/api/user', require('./routes/user'));
app.use('/api/post', require('./routes/post'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/like', require('./routes/like'));

module.exports = app;
