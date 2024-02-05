// Core Modules

// Third Party Modules
const express = require("express");
const cors = require("cors")

// Local Modules

// Express App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

// Listening
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});