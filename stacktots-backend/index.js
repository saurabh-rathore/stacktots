const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
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

const db = require('./db');
const bcrypt = require('bcrypt');

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Registration successful' });
    });
  });
});

const contentRoutes = require('./routes/content');
app.use('/api/content', contentRoutes);

const rewardsRoutes = require('./routes/rewards');
app.use('/api/rewards', rewardsRoutes);

const subscriptionRoutes = require('./routes/subscriptions');
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/api/parental-controls', verifyToken, (req, res) => {
  db.query('SELECT * FROM parental_controls WHERE user_id = ?', [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results[0] || {});
  });
});

app.post('/api/parental-controls', verifyToken, (req, res) => {
  const { content_access } = req.body;
  db.query(
    'INSERT INTO parental_controls (user_id, content_access) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_access = ?',
    [req.userId, content_access, content_access],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Settings updated successfully' });
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
