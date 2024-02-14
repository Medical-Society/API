const server = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT ?? 3000;

//connection
mongoose
    .connect(process.env.MONGODB_URL_EU)
    .then(() => server.listen(port))
    .then(() => console.log(`connect to mongoDb and listen on port ${port}`))
    .catch((err) => console.log(err));
