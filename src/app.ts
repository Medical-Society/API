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
import errorHandler from './middlewares/errors';

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

// Error handling
app.use(errorHandler);

export default http.createServer(app);
// admin -> sign up , login , change doctor status
// doctor -> sign up , login , search for doctor , get doctor by id , verify doctor email 
//