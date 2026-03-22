const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Seed projects (Initial setup)
router.post('/seed', async (req, res) => {
    const initialProjects = [
        {
            title: "DropBasket",
            subtitle: "DropBasket-Useful grocery at your home",
            description: "Full-stack MERN grocery delivery platform with product browsing, cart management, and order handling.",
            techStack: "React • NodeJS • MongoDB • Express",
            projectLink: "https://drop-basket-groceries-delivery-webs.vercel.app/"
        },
        {
            title: "ConvoHub",
            subtitle: "ConvoHub",
            description: "MERN stack real-time chat application with instant messaging using Socket.IO and a responsive user interface.",
            techStack: "MongoDB • Express • React • Node.js • Socket.IO",
            githubLink: "https://github.com/yourusername/convohub"
        },
        {
            title: "CodeCollab",
            subtitle: "CodeCollab",
            description: "Real-time collaborative code editor that allows multiple users to write and edit code together instantly.",
            techStack: "React • Node.js • Express • MongoDB • Socket.IO",
            projectLink: "https://sanujtiwari.github.io/Position-Change/"
        }
    ];

    try {
        await Project.deleteMany({});
        const seededProjects = await Project.insertMany(initialProjects);
        res.status(201).json(seededProjects);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
