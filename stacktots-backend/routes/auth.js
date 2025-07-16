const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../email');

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const verificationToken = crypto.randomBytes(20).toString('hex');

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    db.query(
      'INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)',
      [name, email, hash, verificationToken],
      async (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        try {
          await sendVerificationEmail(email, verificationToken);
          res.json({ message: 'Registration successful. Please check your email to verify your account.' });
        } catch (error) {
          res.status(500).json({ error: 'Failed to send verification email' });
        }
      }
    );
  });
});

router.get('/verify-email', (req, res) => {
  const { token } = req.query;
  db.query('SELECT * FROM users WHERE verification_token = ?', [token], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
    const user = results[0];
    db.query('UPDATE users SET is_verified = true, verification_token = NULL WHERE id = ?', [user.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Email verified successfully' });
    });
  });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }
    const user = results[0];
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour
    db.query(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [token, expires, user.id],
      async (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        try {
          await sendPasswordResetEmail(user.email, token);
          res.json({ message: 'Password reset email sent' });
        } catch (error) {
          res.status(500).json({ error: 'Failed to send password reset email' });
        }
      }
    );
  });
});

router.post('/reset-password', (req, res) => {
  const { token, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > ?',
    [token, Date.now()],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired password reset token' });
      }
      const user = results[0];
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        db.query(
          'UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
          [hash, user.id],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: err });
            }
            res.json({ message: 'Password reset successfully' });
          }
        );
      });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      if (isMatch) {
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  });
});

module.exports = router;
