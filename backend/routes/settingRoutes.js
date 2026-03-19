const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/', protect, admin, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    if (req.body.offerText !== undefined) {
      settings.offerText = req.body.offerText;
    }
    if (req.body.offerIsActive !== undefined) {
      settings.offerIsActive = req.body.offerIsActive;
    }
    if (req.body.paymentQRCode !== undefined) {
      settings.paymentQRCode = req.body.paymentQRCode;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
