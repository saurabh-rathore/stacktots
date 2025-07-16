const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const contentRoutes = require('./routes/content');
app.use('/api/content', contentRoutes);

const rewardsRoutes = require('./routes/rewards');
app.use('/api/rewards', rewardsRoutes);

const subscriptionRoutes = require('./routes/subscriptions');
app.use('/api/subscriptions', subscriptionRoutes);

const uploadRoutes = require('./routes/uploads');
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));

const ttsRoutes = require('./routes/tts');
app.use('/api/tts', ttsRoutes);

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
