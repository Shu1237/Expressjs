

import 'dotenv/config';
import express from 'express';
import router from './routes/index.js'
// import './stategies/local-stategy.js'
import passport from 'passport';
import { connectDB } from './congfig.js';
import cookieParser from 'cookie-parser'; 
import cors from 'cors'

const app = express();



const PORT = process.env.PORT || 4000

await connectDB();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json())
// app.use(sessionConfig)
// app.use(passport.initialize());
// app.use(passport.session())
app.use(router)
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`)
});