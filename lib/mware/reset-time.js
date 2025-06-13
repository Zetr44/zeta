const express = require('express');
const router = express.Router();

router.get('/reset-time', (req, res) => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const msUntilReset = midnight - now;

  res.json({
    serverTime: now.toISOString(),
    msUntilReset,
  });
});

module.exports = router;