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

// CORS ayarları
const corsOptions = {
    origin: '*', // Gerekirse belirli origin'ler ekleyebilirsiniz, örn: 'http://localhost:3000'
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilen HTTP metodları
    allowedHeaders: ['Content-Type', 'Authorization'], // İzin verilen başlıklar
};

app.use(cors(corsOptions)); // CORS'u uygulayın
app.use(bodyParser.json()); // JSON verileri için body-parser kullanımı

// Route'lar
app.use('/admin', adminRouter);
app.use('/user', userRouter);

// IP adresi almak için örnek bir endpoint
app.get('/user/get-ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({ ip });
});

// Sunucu başlatma
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

// Bot'u başlatma
startBot();

// Sequelize senkronizasyonu (force: true'yi development için kullanın, production'da dikkatli olun)
//  sequelize.sync({ force: true });

// Bot'un durdurulması için sinyal işleyicileri
process.once('SIGINT', () => startBot.stop('SIGINT'));
process.once('SIGTERM', () => startBot.stop('SIGTERM'));
