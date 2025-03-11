import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Atlas Connection
// const MONGO_URI = 'your_mongodb_atlas_onnection_string';
const MONGO_URI = 'mongodb+srv://abd:123@cluster0.u5omh.mongodb.net/intern_event_reminder?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schema & Model
const formSchema = new mongoose.Schema({
    username: String,
    email: String
});
const FormData = mongoose.model('FormData', formSchema);

// Handle Form Submission
app.post('/submit', async (req, res) => {
    try {
        const newFormEntry = new FormData(req.body);
        await newFormEntry.save();
        res.json({ message: 'Data saved successfully!', data: newFormEntry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
