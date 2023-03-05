import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
config();


const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

export { app, port }