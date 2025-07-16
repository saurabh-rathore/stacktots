const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
}).single('contentFile');

router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.status(500).json({ error: err });
    } else {
      res.json({
        filePath: `/uploads/${req.file.filename}`
      });
    }
  });
});

module.exports = router;
