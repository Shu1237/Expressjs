

import 'dotenv/config';
import express from 'express';
import router from './routes/index.js'
import { connectDB, corOption } from './congfig.js';
import cookieParser from 'cookie-parser'; 
import cors from 'cors'
import { swaggerSpec, swaggerUi } from './swagger.js';
import open from 'open';
const app = express();



const PORT = process.env.PORT || 4000

await connectDB();

app.use(cors(corOption));

app.use(cookieParser());
app.use(express.json())
app.use(router)
app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerSpec));
app.listen(PORT, () => {
   const url = `http://localhost:${PORT}/api-docs`;
  console.log(`Running on Port ${PORT}`)
   open(url); 
});