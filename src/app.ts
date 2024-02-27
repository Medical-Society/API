// Core Modules

// Third Party Modules
require('dotenv').config();
import express from 'express';
import http from 'http';
import cors from 'cors';

// Local Modules

import patientRouter from './routes/patient';
import doctorRouter from './routes/doctor';
import adminRouter from './routes/admin';

// Express App
const app = express();

// Middlewares
app.use(cors());

// Setting up the bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/v1/doctors', doctorRouter);
app.use('/api/v1/patients', patientRouter);
app.use('/api/v1/admins', adminRouter);
export default http.createServer(app);
