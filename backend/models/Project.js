const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: String, required: true },
    projectLink: { type: String },
    githubLink: { type: String },
    order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Project', projectSchema);
