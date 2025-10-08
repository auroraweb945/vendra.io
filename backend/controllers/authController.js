// backend/controllers/authController.js 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const Joi = require('joi'); 
const crypto = require('crypto'); 
const { 
  findUserByEmail, 
  createUser, 
  findUserByResetToken, 
  updatePassword, 
  saveResetToken, 
} = require('../models/userModel'); 
const sendMail = require('../utils/email'); 

const userSchema = Joi.object({ 
  name: Joi.string().min(2).required(), 
  email: Joi.string().email().required(), 
  password: Joi.string().min(6).required(), 
}); 

// Signup 
exports.signup = async (req, res) => { 
  const { error } = userSchema.validate(req.body); 
  if (error) return res.status(400).json({ message: error.details[0].message }); 

  const { name, email, password } = req.body; 

  try { 
    const existingUser = await findUserByEmail(email); 
    if (existingUser) { 
      return res.status(409).json({ message: 'User already exists' }); 
    } 

    const hashedPassword = await bcrypt.hash(password, 10); 
    await createUser({ name, email, password: hashedPassword }); 

    res.status(201).json({ message: 'User created successfully' }); 
  } catch (err) { 
    console.error('Signup error:', err); 
    res.status(500).json({ message: 'Server error' }); 
  } 
}; 

// Login 
exports.login = async (req, res) => { 
  const { email, password } = req.body; 

  try { 
    const user = await findUserByEmail(email); 
    if (!user) return res.status(401).json({ message: 'Invalid credentials' }); 

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' }); 

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { 
      expiresIn: '7d', 
    }); 

    res.status(200).json({ token }); 
  } catch (err) { 
    console.error('Login error:', err); 
    res.status(500).json({ message: 'Server error' }); 
  } 
}; 

// Forgot Password 
exports.forgotPassword = async (req, res) => { 
  const { email } = req.body; 

  try { 
    const user = await findUserByEmail(email); 
    if (!user) return res.status(404).json({ message: 'Email not found' }); 

    const token = crypto.randomBytes(32).toString('hex'); 
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes 

    await saveResetToken(email, token, expiry); 

    const resetLink = `http://localhost:5173/reset-password?token=${token}`; 

    await sendMail( 
      email, 
      'Reset Your Password - Vendra', 
      ` 
        <p>Hello ${user.name || ''},</p> 
        <p>We received a request to reset your password. You can reset it by clicking the link below:</p> 
        <p><a href="${resetLink}" target="_blank" style="color:#7b2ff7; font-weight:bold;">Reset Password</a></p> 
        <p>This link will expire in 15 minutes.</p> 
        <br /> 
        <p>If you didn't request this, you can safely ignore this email.</p> 
        <br /> 
        <p>– The Vendra Team</p> 
      ` 
    ); 

    res.json({ message: 'Password reset link sent to your email' }); 
  } catch (err) { 
    console.error('Forgot password error:', err); 
    res.status(500).json({ message: 'Server error' }); 
  } 
}; 

// Reset Password 
exports.resetPassword = async (req, res) => { 
  const { token, newPassword } = req.body; 
  if (!token || !newPassword) { 
    return res.status(400).json({ message: 'Token and new password required' }); 
  } 

  try { 
    const user = await findUserByResetToken(token); 
    if (!user) { 
      return res.status(400).json({ message: 'Invalid or expired token' }); 
    } 

    const hashedPassword = await bcrypt.hash(newPassword, 10); 
    await updatePassword(user.id, hashedPassword); 

    res.json({ message: 'Password updated successfully' }); 
  } catch (err) { 
    console.error('Reset password error:', err); 
    res.status(500).json({ message: 'Server error' }); 
  } 
};
