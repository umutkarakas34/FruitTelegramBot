require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const sequelize = require('./utility/db');
const startBot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

startBot();

// sequelize.sync({ force: true });

process.once('SIGINT', () => startBot.stop('SIGINT'));
process.once('SIGTERM', () => startBot.stop('SIGTERM'));
