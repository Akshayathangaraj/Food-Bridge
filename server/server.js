require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = 'your_jwt_secret_key_here'; 

app.use(cors());
app.use(bodyParser.json());

console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

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
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Auth Token:', token); 

  if (!token) return res.status(401).json({ message: 'Access denied, token missing!' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      district,
      city,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/phone or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email/phone or password' });
    }
    const token = jwt.sign(
      { userId: user._id, firstName: user.firstName }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      message: 'Login successful', 
      token,
      userId: user._id,
      firstName: user.firstName 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/donate', async (req, res) => {
  const { name, foodDescription, availableDateTime, phone, address } = req.body;

  if (!name || !foodDescription || !availableDateTime || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newDonation = new FoodDonation({ 
      name, 
      foodDescription, 
      availableDateTime, 
      phone, 
      address 
    });
    await newDonation.save();
    res.status(201).json({ message: 'Donation added successfully' });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/donations', async (req, res) => {
  try {
    const currentTime = new Date();
    const donations = await FoodDonation.find({
      availableDateTime: { $gt: currentTime },
      claimed: false
    }).sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/donations/:id/claim', authenticateToken, async (req, res) => {
  const donationId = req.params.id;
  const userId = req.user.userId;

  try {
    const donation = await FoodDonation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.claimed) {
      return res.status(400).json({ message: 'Donation already claimed' });
    }

    donation.claimed = true;
    donation.claimedBy = userId;

    await donation.save();

    res.json({ message: 'Donation claimed successfully' });
  } catch (error) {
    console.error('Claim donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donations by logged-in user
app.get('/api/my-donations', authenticateToken, async (req, res) => {
  try {
    const myDonations = await FoodDonation.find({ phone: req.user.phone });
    res.json(myDonations);
  } catch (err) {
    console.error('Error fetching my donations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donation
app.put('/api/donations/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await FoodDonation.findOneAndUpdate(
      { _id: req.params.id, phone: req.user.phone },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete donation
app.delete('/api/donations/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await FoodDonation.findOneAndDelete({ _id: req.params.id, phone: req.user.phone });
    if (!deleted) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Claimed Donations by logged-in user
app.get('/api/claimed-donations', authenticateToken, async (req, res) => {
  try {
    const claimed = await FoodDonation.find({ claimedBy: req.user.userId });
    res.json(claimed);
  } catch (err) {
    console.error('Error fetching claimed donations:', err);
    res.status(500).json({ error: 'Failed to fetch claimed donations' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  if (app._router && app._router.stack) {
    app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        console.log(`Route path: ${r.route.path}`);
      }
    });
  } else {
    console.warn('No routes are registered on app._router.');
  }
});