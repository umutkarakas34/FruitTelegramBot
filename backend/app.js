require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const User = require('./models/user');
const sequelize = require('./utility/db');

// sequelize.sync({ force: true });

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

bot.start((ctx) => ctx.reply('Merhaba! Hoş geldiniz ' + ctx.from.id + ' ' + ctx.from.username));

// bot.on('text', async (ctx) => {
//     try {
//         const user = await User.findOne({ where: { telegramId: ctx.from.id } });
//         if (user) {
//             ctx.reply(`Merhaba @${ctx.from.username}! Tekrardan hoş geldiniz.`);
//         }
//         else {
//             await User.create({
//                 telegramId: ctx.from.id,
//                 username: ctx.from.username,
//                 first_name: ctx.from.first_name,
//                 last_name: ctx.from.last_name
//             });

//             ctx.reply(`Merhaba @${ctx.from.username} kaydınız oluşturulmuştur.`)
//         }

//     } catch (error) {
//         console.error('Kullanıcı bilgileri kaydedilirken hata:', error);
//         ctx.reply('Bilgileriniz kaydedilirken bir hata oluştu.');
//     }
// });

bot.command('kazan', async (ctx) => {
    try {
        const user = await User.findOne({ where: { telegramId: ctx.from.id } });
        const min = 1;
        const max = 10;
        const randomAmount = (Math.random() * (max - min)) + min;

        if (user) {
            user.token += randomAmount;
            await user.save();
            ctx.reply(`Tebrikler @${ctx.from.username}, ${parseFloat(randomAmount.toFixed(2))} token kazandınız! Şu anki token miktarınız: ${parseFloat(user.token.toFixed(2))}`);
        } else {
            const newUser = await User.create({
                telegramId: ctx.from.id,
                username: ctx.from.username,
                first_name: ctx.from.first_name,
                last_name: ctx.from.last_name,
                token: randomAmount
            });
            ctx.reply(`Hoş geldiniz @${ctx.from.username}, kaydınız oluşturuldu ve ${parseFloat(randomAmount.toFixed(2))} token kazandınız! Şu anki token miktarınız: ${parseFloat(newUser.token.toFixed(2))}`);
            console.log(`Yeni kullanıcı ${ctx.from.username} ${parseFloat(randomAmount.toFixed(2))} token kazandı. Başlangıç token: ${parseFloat(newUser.token.toFixed(2))}`);
        }
    } catch (error) {
        console.error('Token güncellenirken hata:', error);
        ctx.reply('Token güncellenirken bir hata oluştu.');
    }
});

bot.launch();

app.get('/', (req, res) => {
    res.send('Telegram bot çalışıyor!');
});

app.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
