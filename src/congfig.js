
import mongoose from 'mongoose';
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('mongodb connected')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
};
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3001'
];

export const corOption = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
};
