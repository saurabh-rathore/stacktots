const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Get all content
router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM content', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

const { body, validationResult } = require('express-validator');

// Create content
router.post(
  '/',
  verifyToken,
  [
    body('title').notEmpty().trim().escape(),
    body('description').trim().escape(),
    body('type').notEmpty().trim().escape(),
    body('filePath').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, type, filePath } = req.body;
    db.query('INSERT INTO content (title, description, type, url) VALUES (?, ?, ?, ?)', [title, description, type, filePath], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Content created successfully', id: result.insertId });
    });
  }
);

// Update content
router.put('/:id', verifyToken, (req, res) => {
  const { title, description, type, filePath } = req.body;
  db.query('UPDATE content SET title = ?, description = ?, type = ?, url = ? WHERE id = ?', [title, description, type, filePath, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Content updated successfully' });
  });
});

// Delete content
router.delete('/:id', verifyToken, (req, res) => {
  db.query('DELETE FROM content WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Content deleted successfully' });
  });
});

module.exports = router;
