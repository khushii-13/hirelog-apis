const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    companyName: {
        type: String,
        required: true
    },

    companyLogo: {
        type: String, // URL (Cloudinary / S3 / local)
    },

    location: {
        type: String,
        required: true
    },

    jobType: {
        type: String,
        enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
        required: true
    },

    experience: {
        min: { type: Number, default: 0 },
        max: { type: Number }
    },

    salary: {
        min: { type: Number },
        max: { type: Number }
    },

    skillsRequired: [{
        type: String
    }],

    openings: {
        type: Number,
        default: 1
    },

    applicationDeadline: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},
{
    timestamps: true
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;