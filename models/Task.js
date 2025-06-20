import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    description: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    repeat: {
        frequency: {
            type: String,
            enum: ['none', 'daily', 'weekly', 'monthly'],
            default: 'none'
        },
        days: {
            type: [String], //['Mon', 'Wed', 'Fri']
            default: []
        },
    },
    tags: {
        type: [String], //['Daily Routine', 'Study']
        default: []
    },
    createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
    },
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema);
export default Task;