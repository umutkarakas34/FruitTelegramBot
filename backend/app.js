require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const sequelize = require('./utility/db');
const startBot = require('./bot');
const UserTask = require('./models/userTask');


const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: '*', // Gerekirse belirli origin'ler ekleyebilirsiniz
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.get('/user/get-ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({ ip });
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

startBot();

// sequelize.sync({ force: true });

process.once('SIGINT', () => startBot.stop('SIGINT'));
process.once('SIGTERM', () => startBot.stop('SIGTERM'));
