const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Get all rewards
router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM rewards', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Get user's points
router.get('/points', verifyToken, (req, res) => {
  db.query('SELECT points FROM users WHERE id = ?', [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results[0]);
  });
});

// Redeem a reward
router.post('/redeem/:id', verifyToken, (req, res) => {
  const rewardId = req.params.id;
  const userId = req.userId;

  db.beginTransaction(err => {
    if (err) { return res.status(500).json({ error: err }); }

    db.query('SELECT points FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err });
        });
      }
      const userPoints = results[0].points;

      db.query('SELECT points_cost FROM rewards WHERE id = ?', [rewardId], (err, results) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err });
          });
        }
        const rewardCost = results[0].points_cost;

        if (userPoints < rewardCost) {
          return db.rollback(() => {
            res.status(400).json({ message: 'Not enough points' });
          });
        }

        db.query('UPDATE users SET points = points - ? WHERE id = ?', [rewardCost, userId], (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err });
            });
          }

          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err });
              });
            }
            res.json({ message: 'Reward redeemed successfully' });
          });
        });
      });
    });
  });
});

module.exports = router;
