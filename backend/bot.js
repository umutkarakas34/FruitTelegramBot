require('dotenv').config();
const { Telegraf } = require('telegraf');
const { User, Referral } = require('./models/relationships');
const crypto = require('crypto');

const bot = new Telegraf(process.env.BOT_TOKEN);

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

bot.start(async (ctx) => {
    const telegramId = ctx.from.id;
    const username = ctx.from.username;
    const firstname = ctx.from.first_name;
    const lastname = ctx.from.last_name;
    const referralCode = ctx.startPayload;

    const url = `https://99ab-188-132-191-150.ngrok-free.app/profile?telegram_id=${telegramId}&username=${username}&firstname=${firstname}&lastname=${lastname}&referralCode=${referralCode}`;
    const url1 = `https://644f-188-132-191-150.ngrok-free.app/?telegram_id=${telegramId}&username=${username}&firstname=${firstname}&lastname=${lastname}&referralCode=${referralCode}`;
    ctx.reply('Play butonuna tıklayın:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'PLAY', web_app: { url: url1 } }]
            ]
        }
    });
});

bot.command('earnings', async (ctx) => {
    try {
        const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

        if (!user) {
            ctx.reply('Kullanıcı bulunamadı.');
            return;
        }

        if (user.ref_earning) {
            ctx.reply(`Toplam referans kazancınız: ${user.ref_earning}`);
        }
        else {
            ctx.reply(`Henüz referans kazancınız yok.`);
        }

    } catch (error) {
        console.error('Kazanç hesaplanırken hata:', error);
        ctx.reply('Kazanç hesaplanırken bir hata oluştu.');
    }
});

bot.command('kazan', async (ctx) => {
    try {
        const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
        const min = 1;
        const max = 10;
        const randomAmount = (Math.random() * (max - min)) + min;

        if (user) {
            user.token += randomAmount;
            await user.save();

            // Üst referans kazanç güncelleme
            if (user.referred_by) {
                const referringUser = await User.findByPk(user.referred_by);
                if (referringUser) {
                    const bonus = randomAmount * 0.10; // %10 bonus
                    referringUser.ref_earning += bonus;
                    await referringUser.save();

                    // Üst referansın üst referansını kontrol et ve kazancını güncelle
                    if (referringUser.referred_by) {
                        const superReferringUser = await User.findByPk(referringUser.referred_by);
                        if (superReferringUser) {
                            const superBonus = randomAmount * 0.025; // %2.5 bonus
                            superReferringUser.ref_earning += superBonus;
                            await superReferringUser.save();
                        }
                    }
                }
            }

            ctx.reply(`Tebrikler @${ctx.from.username}, ${parseFloat(randomAmount.toFixed(2))} token kazandınız! Şu anki token miktarınız: ${parseFloat(user.token.toFixed(2))}`);
        } else {
            const newUser = await User.create({
                telegram_id: ctx.from.id,
                username: ctx.from.username,
                first_name: ctx.from.first_name,
                last_name: ctx.from.last_name,
                token: randomAmount
            });
            ctx.reply(`Hoş geldiniz @${ctx.from.username}, kaydınız oluşturuldu ve ${parseFloat(randomAmount.toFixed(2))} token kazandınız! Şu anki token miktarınız: ${parseFloat(newUser.token.toFixed(2))}`);
            // console.log(`Yeni kullanıcı ${ctx.from.username} ${parseFloat(randomAmount.toFixed(2))} token kazandı. Başlangıç token: ${parseFloat(newUser.token.toFixed(2))}`);
        }
    } catch (error) {
        console.error('Token güncellenirken hata:', error);
        ctx.reply('Token güncellenirken bir hata oluştu.');
    }
});

bot.command('claim', async (ctx) => {
    try {
        const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

        if (!user) {
            ctx.reply('Kullanıcı bulunamadı.');
            return;
        }
        if (user.ref_earning && user.ref_earning != 0) {
            const refEarning = user.ref_earning;
            await user.update({
                token: user.token + refEarning,
                ref_earning: 0
            })

            ctx.reply(`Toplam talep edilen kazanç: ${refEarning.toFixed(2)}. Şu anki token miktarınız: ${user.token.toFixed(2)}`);
        }
        else {
            ctx.reply(`Toplanacak referans kazancı bulunamadı.`);
        }

    } catch (error) {
        console.error('Kazanç talep edilirken hata:', error);
        ctx.reply('Kazanç talep edilirken bir hata oluştu.');
    }
});

// bot.command('play', (ctx) => {
//     const telegramId = ctx.from.id;
//     const username = ctx.from.username;
//     const firstname = ctx.from.first_name;
//     const lastname = ctx.from.last_name;
//     const referralCode = ctx.payload;

//     // const url = `https://2246-188-132-191-150.ngrok-free.app/user/login?telegram_id=${telegramId}
//     // &username=${username}&firstname=${firstname}&lastname=${lastname}&referralCode=${referralCode}`;
//     const url1 = ' https://4313-188-132-191-150.ngrok-free.app/user/profile';

//     ctx.reply('Play butonuna tıklayın:', {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: 'PLAY', web_app: { url: url1 } }]
//             ]
//         }
//     });
// });

bot.on('text', async (ctx) => {
    try {
        const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
        if (user) {
            const referralLink = generateReferralLink(ctx.from.username, user.referral_code);
            ctx.reply(`Merhaba @${ctx.from.username}! Tekrardan hoş geldiniz. İşte referans linkiniz: ${referralLink}`);
        } else {
            const newReferralCode = await generateUniqueReferralCode();

            const newUser = await User.create({
                telegram_id: ctx.from.id,
                username: ctx.from.username,
                first_name: ctx.from.first_name,
                last_name: ctx.from.last_name,
                referral_code: newReferralCode
            });

            ctx.reply(`Merhaba @${ctx.from.username}, kaydınız oluşturulmuştur. Referans kodunuz: ${newReferralCode}`);
        }
    } catch (error) {
        console.error('Kullanıcı bilgileri kaydedilirken hata:', error);
        ctx.reply('Bilgileriniz kaydedilirken bir hata oluştu.');
    }
});

const startBot = () => {
    bot.launch();

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

module.exports = startBot;
