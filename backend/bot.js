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
    try {
        const referralCode = ctx.startPayload; // Referans kodunu linkten alıyoruz
        const referringUser = await User.findOne({ where: { referral_code: referralCode } });

        const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
        if (user) {
            ctx.reply(`Merhaba @${ctx.from.username}! Tekrardan hoş geldiniz.`);
        } else {
            const newReferralCode = await generateUniqueReferralCode();

            const newUser = await User.create({
                telegram_id: ctx.from.id,
                username: ctx.from.username,
                first_name: ctx.from.first_name,
                last_name: ctx.from.last_name,
                referral_code: newReferralCode,
                referred_by: referringUser ? referringUser.id : null
            });

            // Referans ilişkilerini ekleme
            if (referringUser) {
                await Referral.create({
                    user_id: newUser.id,
                    referred_user_id: referringUser.id,
                    referral_level: 1
                });

                // İkinci seviye referansları ekle
                if (referringUser.referred_by) {
                    await Referral.create({
                        user_id: newUser.id,
                        referred_user_id: referringUser.referred_by,
                        referral_level: 2
                    });
                }
            }

            ctx.reply(`Merhaba @${ctx.from.username}, kaydınız oluşturulmuştur. Referans kodunuz: ${newReferralCode}`);
        }
    } catch (error) {
        console.error('Kullanıcı bilgileri kaydedilirken hata:', error);
        ctx.reply('Bilgileriniz kaydedilirken bir hata oluştu.');
    }
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

bot.command('play', (ctx) => {
    const url = 'https://google.com/userId=' + ctx.from.id;
    ctx.reply('Play butonuna tıklayın:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'PLAY', web_app: { url: url } }]
            ]
        }
    });
});

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
