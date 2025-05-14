
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('mongodb connected')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
};

// export const sessionConfig = session({
//   secret: 'be',
//   saveUninitialized: false,
//   resave: true,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24,
//   },
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI,
//     collectionName: 'sessions',
//     ttl: 60 * 60 * 24,
//   }),
// });
