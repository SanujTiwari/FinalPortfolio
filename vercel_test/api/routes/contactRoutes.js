const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Post a contact message
router.post('/', async (req, res) => {
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });

    try {
        const newMessage = await contact.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
