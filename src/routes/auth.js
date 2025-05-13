import passport from "passport";
import { Router } from "express";
import jwt from 'jsonwebtoken';
import { Task } from "../mongoose/model/tasks.js";



const router = Router();


router.get('/', async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(200).send({ msg: 'Welcome! Please login.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const listtask = await Task.find({ createdBy: decoded.id });
    res.status(200).send({
      msg: listtask.length === 0 ? 'Welcome! No tasks found.' : 'Welcome back!',
      user: { id: decoded.id, username: decoded.username },
      tasks: listtask,
    });
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).send({ msg: 'Invalid or expired token. Please login again.' });
  }
});



router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ msg: info?.message || 'Login failed' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1d' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      msg: 'Login successful',
      token,
      // user: { id: user._id, username: user.username }
    });
  })(req, res, next);
});


// router.get('/login/status', (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.status(200).send(req.user);
//   } else {
//     return res.status(401).send({ msg: 'Not Authenticated' });
//   }
// });

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  return res.status(200).json({ msg: 'Logout successful' });
});


export default router