import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Form received', data: req.body });
});

app.listen(3000, () => console.log('Server running on port 3000'));
