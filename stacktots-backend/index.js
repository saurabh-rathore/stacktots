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

app.get('/api/parental-controls', (req, res) => {
  // TODO: Fetch settings from the database
  const settings = {
    contentAccess: 'all'
  };
  res.json(settings);
});

app.post('/api/parental-controls', (req, res) => {
  const { contentAccess } = req.body;
  // TODO: Update settings in the database
  res.json({ message: 'Settings updated successfully' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
