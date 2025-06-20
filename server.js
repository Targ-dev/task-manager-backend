import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is running")
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes)

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅MongoDB Connected")

        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`)
        });
    })
    .catch((error) => {
        console.error('❌MongoDB connection error', error.message);
    });