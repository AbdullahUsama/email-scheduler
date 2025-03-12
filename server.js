import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MONGO_URI = 'mongodb+srv://abd:123@cluster0.u5omh.mongodb.net/intern_event_reminder?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

const formSchema = new mongoose.Schema({
    username: String,
    email: String,
    event: String,
    date: Date
});
const FormData = mongoose.model('FormData', formSchema);

// Handle Form Submission
// app.post('/submit', async (req, res) => {
//     try {
//         const newFormEntry = new FormData(req.body);
//         await newFormEntry.save();
//         res.json({ message: 'Data saved successfullyyy!', data: newFormEntry });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

app.post('/submit', async (req, res) => {
    try {
        const { name, email, day, month, customEvent } = req.body;
        let { eventType } = req.body;
        if (customEvent && customEvent.trim() !== '') {
            eventType = customEvent.trim();
        }
        const eventDate = new Date(new Date().getFullYear(), parseInt(month) - 1, parseInt(day)+1);
        eventDate.setUTCHours(0, 0, 0, 0); 
        const newFormEntry = new FormData({
            username: name,
            email,
            event: eventType,
            date: eventDate
        });

        await newFormEntry.save();
        res.json({ message: 'Data saved successfully!', data: newFormEntry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: 'ausama.bese22seecs@seecs.edu.pk',
        pass: 'Kushim@03000',
    }
});

    // cron.schedule('*/8 * * * * *', async () => { // every 5 seconds -- for testing emails
    cron.schedule('30 8 * * *', async () => { // every day at 8 30 AM
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const events = await FormData.find({
        date: { $gte: today, $lt: tomorrow }
    });

    for (const event of events) {
        const mailOptions = {
            from: 'ausama.bese22seecs@seecs.edu.pk',
            to: event.email,
            subject: `Reminder: ${event.event} Today!`,
            text: `Hello ${event.username},\n\nThis is a reminder for your event: ${event.event} scheduled for today.\n\nBest Regards.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log(`Email sent to ${event.email}: ${info.response}`);
            }
        });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
