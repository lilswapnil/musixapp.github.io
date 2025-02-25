const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/musix-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' }
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
  const { email, username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.json({ success: false, message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, username, password: hashedPassword });
  await user.save();

  res.json({ success: true });
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.json({ success: true, token });
});

// Get User Details Endpoint
app.get('/api/user', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(decoded.userId);

  res.json(user);
});

// Update User Details Endpoint
app.put('/api/user', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const { username, email, profilePicture } = req.body;

  const user = await User.findByIdAndUpdate(
    decoded.userId,
    { username, email, profilePicture },
    { new: true }
  );

  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});