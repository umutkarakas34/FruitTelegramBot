require('dotenv').config();
const { Telegraf } = require('telegraf');
const { User, Referral } = require('./models/relationships');
const crypto = require('crypto');

const bot = new Telegraf(process.env.BOT_TOKEN);

const blockedUsers = new Set();

function generateReferralCode() {
    return crypto.randomBytes(4).toString('hex'); // 8 karakterlik bir referans kodu oluşturur
}

const generateReferralLink = (username, referralCode) => {
    return `https://t.me/testbot_gamegamebot?start=${referralCode}`;
};

const generateUniqueReferralCode = async () => {
    let referralCode;
    let isUnique = false;

    while (!isUnique) {
        referralCode = generateReferralCode();
        const existingUser = await User.findOne({ where: { referral_code: referralCode } });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return referralCode;
};

bot.catch((err, ctx) => {
    if (err.response && err.response.error_code === 403 && err.response.description === 'Forbidden: bot was blocked by the user') {
        const chatId = ctx.update.message.chat.id;
        blockedUsers.add(chatId);
        console.log(`User ${chatId} has blocked the bot.`);
    } else {
        console.error('Error:', err);
    }
});

const sendMessageToUser = async (chatId, text, options = {}) => {
    if (blockedUsers.has(chatId)) {
        console.log(`Cannot send message to user ${chatId}, as they have blocked the bot.`);
        return;
    }

    try {
        await bot.telegram.sendMessage(chatId, text, options);
    } catch (error) {
        if (error.response && error.response.error_code === 403) {
            console.log(`User ${chatId} has blocked the bot.`);
            blockedUsers.add(chatId);
        } else {
            console.error('Error sending message:', error);
        }
    }
};

bot.start(async (ctx) => {
    const telegramId = ctx.from.id;
    const username = ctx.from.username;
    const firstname = ctx.from.first_name;
    const lastname = ctx.from.last_name;
    const referralCode = ctx.startPayload;

    // const url = `https://854cd2ab4064504b0d367ce4df50de6b.serveo.net/profile?telegram_id=${telegramId}&username=${username}&firstname=${firstname}&lastname=${lastname}&referralCode=${referralCode}`;
    const url1 = `https://fruitcrypto.online/?telegram_id=${telegramId}&username=${username}&firstname=${firstname}&lastname=${lastname}&referralCode=${referralCode}`;
    await sendMessageToUser(ctx.from.id, `Welcome to Fruit Crypto! 🍓✨🎉🎉\n\n
Step into the exciting world of Fruit Crypto, where your passion for gaming meets the power of cryptocurrency. We’re not just a bot; we’re on our way to becoming the ultimate super app for crypto enthusiasts!\n\n 
What makes Fruit Crypto special?\n\n 
🎮 Earn Crypto Points: Engage in thrilling fruit slicing games to collect Fruit Points (FPs) and turn your gaming skills into real rewards.\n
👫 Invite Friends: The more, the merrier! Invite your friends and family to join the fun and earn extra CPs for every referral.\n
🏆 Complete Quests: Take on a variety of exciting quests to boost your CPs and unlock exclusive rewards.\n\n
Join us now and be a part of the revolution. With Fruit Crypto, the future of gaming and cryptocurrency is in
your hands!\n\nStay Juicy and Keep Slicing! 🍉🍈🍍`, 
         {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'PLAY', web_app: { url: url1 } }],
                [{ text: 'Join our Telegram Channel', url: 'https://t.me/FruitCryptoApp' }]
            ]
        }
    });
    
});

// bot.command('earnings', async (ctx) => {
//     try {
//         const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

//         if (!user) {
//             await sendMessageToUser(ctx.from.id, 'Kullanıcı bulunamadı.');
//             return;
//         }

//         if (user.ref_earning) {
//             await sendMessageToUser(ctx.from.id, `Toplam referans kazancınız: ${user.ref_earning}`);
//         } else {
//             await sendMessageToUser(ctx.from.id, `Henüz referans kazancınız yok.`);
//         }
//     } catch (error) {
//         console.error('Kazanç hesaplanırken hata:', error);
//         await sendMessageToUser(ctx.from.id, 'Kazanç hesaplanırken bir hata oluştu.');
//     }
// });

// bot.command('kazan', async (ctx) => {
//     try {
//         const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
//         const min = 1;
//         const max = 10;
//         const randomAmount = (Math.random() * (max - min)) + min;

//         if (user) {
//             user.token += randomAmount;
//             await user.save();

//             // Üst referans kazanç güncelleme
//             if (user.referred_by) {
//                 const referringUser = await User.findByPk(user.referred_by);
//                 if (referringUser) {
//                     const bonus = randomAmount * 0.10; // %10 bonus
//                     referringUser.ref_earning += bonus;
//                     await referringUser.save();

//                     // Üst referansın üst referansını kontrol et ve kazancını güncelle
//                     if (referringUser.referred_by) {
//                         const superReferringUser = await User.findByPk(referringUser.referred_by);
//                         if (superReferringUser) {
//                             const superBonus = randomAmount * 0.025; // %2.5 bonus
//                             superReferringUser.ref_earning += superBonus;
//                             await superReferringUser.save();
//                         }
//                     }
//                 }
//             }

//             await sendMessageToUser(ctx.from.id, `Tebrikler @${ctx.from.username}, ${parseFloat(randomAmount.toFixed(2))} token kazandınız! Şu anki token miktarınız: ${parseFloat(user.token.toFixed(2))}`);
//         } else {
//             const newUser = await User.create({
//                 telegram_id: ctx.from.id,
//                 username: ctx.from.username,
//                 first_name: ctx.from.first_name,
//                 last_name: ctx.from.last_name,
//                 token: randomAmount
//             });
//             await sendMessageToUser(ctx.from.id, `Hoş geldiniz @${ctx.from.username}, kaydınız oluşturuldu ve ${parseFloat(randomAmount.toFixed(2))} token kazandınız! Şu anki token miktarınız: ${parseFloat(newUser.token.toFixed(2))}`);
//         }
//     } catch (error) {
//         console.error('Token güncellenirken hata:', error);
//         await sendMessageToUser(ctx.from.id, 'Token güncellenirken bir hata oluştu.');
//     }
// });

// bot.command('claim', async (ctx) => {
//     try {
//         const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

//         if (!user) {
//             await sendMessageToUser(ctx.from.id, 'Kullanıcı bulunamadı.');
//             return;
//         }
//         if (user.ref_earning && user.ref_earning != 0) {
//             const refEarning = user.ref_earning;
//             await user.update({
//                 token: user.token + refEarning,
//                 ref_earning: 0
//             });

//             await sendMessageToUser(ctx.from.id, `Toplam talep edilen kazanç: ${refEarning.toFixed(2)}. Şu anki token miktarınız: ${user.token.toFixed(2)}`);
//         } else {
//             await sendMessageToUser(ctx.from.id, `Toplanacak referans kazancı bulunamadı.`);
//         }

//     } catch (error) {
//         console.error('Kazanç talep edilirken hata:', error);
//         await sendMessageToUser(ctx.from.id, 'Kazanç talep edilirken bir hata oluştu.');
//     }
// });

// bot.on('text', async (ctx) => {
//     try {
//         const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
//         if (user) {
//             const referralLink = generateReferralLink(ctx.from.username, user.referral_code);
//             await sendMessageToUser(ctx.from.id, `Merhaba @${ctx.from.username}! Tekrardan hoş geldiniz. İşte referans linkiniz: ${referralLink}`);
//         } else {
//             const newReferralCode = await generateUniqueReferralCode();

//             const newUser = await User.create({
//                 telegram_id: ctx.from.id,
//                 username: ctx.from.username,
//                 first_name: ctx.from.first_name,
//                 last_name: ctx.from.last_name,
//                 referral_code: newReferralCode
//             });

//             await sendMessageToUser(ctx.from.id, `Merhaba @${ctx.from.username}, kaydınız oluşturulmuştur. Referans kodunuz: ${newReferralCode}`);
//         }
//     } catch (error) {
//         console.error('Kullanıcı bilgileri kaydedilirken hata:', error);
//         await sendMessageToUser(ctx.from.id, 'Bilgileriniz kaydedilirken bir hata oluştu.');
//     }
// });

const startBot = () => {
    bot.launch();

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

module.exports = startBot;
