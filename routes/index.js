const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/guns');
  }

  return res.redirect('/login');
});

module.exports = router;
