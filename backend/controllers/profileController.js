const bcrypt = require('bcrypt');
const pool = require('../config/db');
const {
  findUserById,
  updateUserName,
  updateUserEmail,
  findUserByEmailExcludingId,
  updateUserPassword,
} = require('../models/userModel');
const sendMail = require('../utils/email');

// Get profile info
exports.getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, s.id AS store_id, s.name AS store_name, s.slug AS store_slug
       FROM users u
       LEFT JOIN stores s ON u.id = s.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      store: user.store_id
        ? { id: user.store_id, name: user.store_name, slug: user.store_slug }
        : null,
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'DB error' });
  }
};

// Update name
exports.updateName = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    await updateUserName(req.user.id, name);
    res.json({ message: 'Name updated successfully' });
  } catch (err) {
    console.error('Update name error:', err);
    res.status(500).json({ error: 'Failed to update name' });
  }
};

// Update email
exports.updateEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const existing = await findUserByEmailExcludingId(email, req.user.id);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    await updateUserEmail(req.user.id, email);
    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    console.error('Update email error:', err);
    res.status(500).json({ error: 'Failed to update email' });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old and new passwords are required' });
  }

  try {
    const users = await findUserById(req.user.id, true); // true = include password
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = users[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(req.user.id, hashedPassword);

    res.json({ message: 'Password updated successfully' });

    // Send confirmation email
    sendMail(
      user.email,
      'Your Password Was Updated',
      `
      <p>Hello ${user.name || ''},</p>
      <p>This is a confirmation that your password was successfully changed for your Vendra account.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
      <br />
      <p>– The Vendra Team</p>
    `
    ).catch((err) => {
      console.error('Failed to send confirmation email:', err);
    });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
};
