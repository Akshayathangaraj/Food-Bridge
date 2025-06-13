require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Food Donation Schema
const foodDonationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  foodDescription: { type: String, required: true },
  availableDateTime: { type: Date, required: true },
  phone: { type: String, required: true },
  address: {
    detailedAddress: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  claimed: { type: Boolean, default: false },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied, token missing!' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, district, city, email, phone, password } = req.body;

  if (!firstName || !lastName || !district || !city || !phone || !password) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, district, city, email, phone, password: hashedPassword });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, firstName: user.firstName }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login successful', token, userId: user._id, firstName: user.firstName });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Donation POST Route (userId required)
app.post('/api/donate', authenticateToken, async (req, res) => {
  const { name, foodDescription, availableDateTime, phone, address } = req.body;
  const userId = req.user.userId;

  if (!name || !foodDescription || !availableDateTime || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newDonation = new FoodDonation({
      name, foodDescription, availableDateTime, phone, address, userId
    });

    await newDonation.save();
    res.status(201).json({ message: 'Donation added successfully' });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all available (unclaimed) donations
app.get('/api/donations', async (req, res) => {
  try {
    const now = new Date();
    const donations = await FoodDonation.find({
      availableDateTime: { $gt: now },
      claimed: false
    }).sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error('Fetch donations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim Donation
app.put('/api/donations/:id/claim', authenticateToken, async (req, res) => {
  const donationId = req.params.id;
  const userId = req.user.userId;

  try {
    const donation = await FoodDonation.findById(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.claimed) return res.status(400).json({ message: 'Already claimed' });

    donation.claimed = true;
    donation.claimedBy = userId;

    await donation.save();
    res.json({ message: 'Donation claimed successfully' });
  } catch (error) {
    console.error('Claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all donations posted by a specific user
app.get('/api/donations/user/:userId', async (req, res) => {
  try {
    const userDonations = await FoodDonation.find({ userId: req.params.userId }).sort({ availableDateTime: -1 });
    res.status(200).json(userDonations);
  } catch (error) {
    console.error('User donations fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching user donations' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
