// Core Modules

// Third Party Modules
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');

// Local Modules
const patientRouter = require('./routes/patient');
const doctorRouter = require('./routes/doctor');
const adminRouter = require('./routes/admin');

// Express App
const app = express();

// Middlewares
app.use(cors());

// Setting up the bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/v1/doctors', doctorRouter);
app.use('/api/v1/patients', patientRouter);
app.use('/api/v1/admins', adminRouter);

module.exports = http.createServer(app);
