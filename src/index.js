

import 'dotenv/config';
import express from 'express';
import router from './routes/index.js'
// import './stategies/local-stategy.js'
import passport from 'passport';
import { connectDB } from './congfig.js';
import cookieParser from 'cookie-parser'; 


const app = express();



const PORT = process.env.PORT || 4000

await connectDB();
// app.use(cookieParser());
app.use(express.json())
// app.use(sessionConfig)
// app.use(passport.initialize());
// app.use(passport.session())
app.use(router)
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`)
});