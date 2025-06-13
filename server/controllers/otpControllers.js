require('dotenv').config();
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const otpStore = {}; // For demo, store OTPs in memory

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOtp = async (req, res) => {
  const { email, phone } = req.body;
  if (!email && !phone) return res.status(400).json({ message: 'Email or phone required' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 5 * 60 * 1000;
  const recipient = email || phone;

  otpStore[recipient] = { otp, expiresAt };

  try {
    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Food Bridge OTP',
        text: `Your OTP is: ${otp}`
      });
    } else {
      await twilioClient.messages.create({
        body: `Food Bridge OTP: ${otp}`,
        from: process.env.TWILIO_PHONE,
        to: phone
      });
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, phone, otp } = req.body;
  const recipient = email || phone;
  const record = otpStore[recipient];

  if (!record) return res.status(400).json({ message: 'OTP not sent yet' });
  if (record.expiresAt < Date.now()) {
    delete otpStore[recipient];
    return res.status(400).json({ message: 'OTP expired' });
  }
  if (parseInt(otp, 10) === record.otp) {
    delete otpStore[recipient];
    return res.json({ verified: true });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};
