// Core Modules

// Third Party Modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const cors = require('cors');

// Local Modules
patientRouter = require('./routes/patient');
const cors = require('cors');

// Local Modules
const Doctor = require('./routes/doctor');
require('./db/db');

// Express App

const app = express();
const server = http.createServer(app);

// Middlewares

app.use(express.json());
app.use(cors());

// Setting up the bodyParser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/v1/doctors', Doctor);

// app.use('/api/patient', patientRouter);

//connection

const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => server.listen(port))
    .then(() => console.log(`connect to mongoDb and listen on port ${port}`))
    .catch((err) => console.log(err));
