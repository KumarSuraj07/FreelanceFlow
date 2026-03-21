const admin = require('../utils/firebase');
const User = require('../models/User');

const safeError = (res, err, status = 500) => {
  console.error(err);
  res.status(status).json({ message: status < 500 ? err.message : 'Internal server error' });
};

// Called after Firebase signup/login — syncs user to MongoDB and returns user data
exports.syncUser = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name: firebaseName } = decoded;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      const { name } = req.body;
      user = await User.create({
        firebaseUid: uid,
        name: name || firebaseName || email.split('@')[0],
        email: email.toLowerCase(),
      });
    }

    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, location: user.location } });
  } catch (err) {
    safeError(res, err);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;

    if (!name?.trim() || !email?.trim())
      return res.status(400).json({ message: 'Name and email are required' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim(), email: email.toLowerCase(), phone: phone?.trim(), location: location?.trim() },
      { new: true, runValidators: true }
    );

    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, location: user.location } });
  } catch (err) {
    safeError(res, err);
  }
};
