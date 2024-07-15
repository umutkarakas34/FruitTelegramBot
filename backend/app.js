require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const sequelize = require('./utility/db');
const startBot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.send('Telegram bot çalışıyor!');
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

startBot();

// Eğer sequelize.sync() kullanmanız gerekiyorsa, bu kısmı da ekleyin
// sequelize.sync().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Sunucu ${PORT} portunda çalışıyor`);
//     });
// });

process.once('SIGINT', () => startBot.stop('SIGINT'));
process.once('SIGTERM', () => startBot.stop('SIGTERM'));
