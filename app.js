"use strict"

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const express_session = require('express-session');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/salend_session', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("W: OPEN!!")
    })
    .catch(err => {
        console.log("W: ERROR!!")
    })

app.use(express_session({
    secret: "@)))))))))",
    resave: false,
    saveUninitialized: false,
    store:require('mongoose-session')(mongoose),
    cookie:{maxAge:(3.6e+6)*3}   // 3시간 후 만료
}));

// https://kimjingo.tistory.com/43
// express-session & mongoose 세션 사용하기

const reqPre = (req, res, next) => {
    console.log(new Date().toLocaleString());
    var fullUrl = req.method + " :: " + req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl);
    next();
}

app.use(reqPre); // 접속 Log 추적

app.set("views", "src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const route = require('./src/index.js');
app.use("/", route)

module.exports = app;
