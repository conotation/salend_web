"use strict"

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

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
