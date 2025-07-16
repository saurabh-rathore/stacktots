const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');
const pdf = require('pdf-parse');
const say = require('say.js');
const fs = require('fs');
const path = require('path');

router.get('/:id', verifyToken, (req, res) => {
  const contentId = req.params.id;

  db.query('SELECT * FROM content WHERE id = ?', [contentId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const content = results[0];
    const pdfPath = path.join(__dirname, '..', content.url);

    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read PDF file' });
      }

      pdf(data).then(function(data) {
        const text = data.text;
        const audioFilePath = path.join(__dirname, '..', 'uploads', `${contentId}.wav`);

        say.export(text, null, 1, audioFilePath, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to generate audio' });
          }
          res.sendFile(audioFilePath);
        });
      });
    });
  });
});

module.exports = router;
