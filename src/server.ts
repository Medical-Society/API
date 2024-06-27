import server from './app';
import './socket';
import mongoose from 'mongoose';

const port = process.env.PORT as string;

//connection
mongoose
  .connect(process.env.MONGODB_URL_EU as string)
  .then(() => server.listen(port))
  .then(() => console.log(`connect to mongoDb and listen on port ${port}`))
  .catch((err: any) => console.log(err));
