const router = require('./routes/router');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');
const morgan = require('morgan');
const winston = require('./config/winston');
const cors = require('cors');

require('./config/passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/"));
app.use(express.static("client/build"))
app.use(cors())

// Logging middleware
app.use(morgan('combined', { stream: winston.stream }));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set("useCreateIndex", true);

app.use(passport.initialize());
app.use(passport.session());

app.use("/external", router.external);
app.use("/student", router.student);
app.use("/professor", router.professor);
app.use("/platform", router.platform);
app.use("/api", router.api);
app.use("/", router.home);

// Error handling middleware
app.use((error, req, res, next) => {
    if(res.headersSent){
        return next(error)
    }
    winston.error(`${error.message} - ${error.stack}`);
    res.status(error.status || 500);
    res.json(error.message);
});


app.listen(PORT, function(){
    console.log('Server started on port ' + PORT);
});
