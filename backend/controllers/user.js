const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Referral = require('../models/referral');
const crypto = require('crypto');
const Task = require('../models/task');
const DailyCheckin = require('../models/dailyCheckin');
const Game = require('../models/game');
const Farming = require('../models/farming');
const { message } = require('telegraf/filters');


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
const handleDailyCheckin = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Bugünkü check-in'i kontrol et
        const existingCheckin = await DailyCheckin.findOne({
            where: {
                user_id: userId,
                checkin_date: today
            }
        });

        if (!existingCheckin) {
            // Kullanıcının son check-in tarihini al
            const lastCheckin = await DailyCheckin.findOne({
                where: { user_id: userId },
                order: [['checkin_date', 'DESC']]
            });

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            if (!lastCheckin) {
                await DailyCheckin.create({
                    user_id: userId,
                    checkin_date: today,
                    checkin_series: 1
                });
                return;
            }
            if (lastCheckin && lastCheckin.checkin_date === yesterdayStr) {
                // Kullanıcı check-in serisini 1 artır
                await lastCheckin.update({
                    user_id: userId,
                    checkin_date: today,
                    checkin_series: lastCheckin.checkin_series + 1
                });
                await User.increment('checkin_series', { where: { id: userId } });
            } else {
                await lastCheckin.destroy();
                await DailyCheckin.create({
                    user_id: userId,
                    checkin_date: today,
                    checkin_series: 1
                });
                await User.update({ checkin_series: 1 }, { where: { id: userId } });
            }
        }
    } catch (error) {
        console.error("Check-in işlemi sırasında hata oluştu:", error);
    }
};
const login = async (req, res) => {
    try {
        const telegramId = req.query.telegram_id;
        const username = req.query.username;
        const firstname = req.query.firstname;
        const lastname = req.query.lastname;
        const referralCode = req.query.referralCode;

        if (!telegramId || !username) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = await User.findOne({ where: { telegram_id: telegramId } });

        if (user) {
            // Check-in işlemi
            await handleDailyCheckin(user.id);

            const refCount = await User.count({ where: { referred_by: user.id } });
            const dailyCheckinCount = await DailyCheckin.findOne({ where: { user_id: user.id } });
            return res.status(200).json({ id: user.id, username: user.username, token: user.token, ticket: user.ticket, ref_earning: user.ref_earning, refCount: refCount, DailyCheckinCount: dailyCheckinCount.checkin_series });
        } else {
            let referringUser = null;
            let refCount = 0;

            if (referralCode) {
                referringUser = await User.findOne({ where: { referral_code: referralCode } });
                if (referringUser) {
                    refCount = await User.count({ where: { referred_by: referringUser.id } });
                }
            }

            const newReferralCode = await generateUniqueReferralCode();

            if (referringUser && refCount < 10) {
                const newUser = await User.create({
                    telegram_id: telegramId,
                    username: username,
                    first_name: firstname,
                    last_name: lastname,
                    referral_code: newReferralCode,
                    referred_by: referringUser.id
                });

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

                // Check-in işlemi
                await handleDailyCheckin(newUser.id);
                const dailyCheckinCount = await DailyCheckin.findOne({ where: { user_id: newUser.id } });

                return res.status(200).json({ id: newUser.id, username: newUser.username, token: newUser.token, ticket: newUser.ticket, ref_earning: newUser.ref_earning, refCount: 0, DailyCheckinCount: 1 });
            } else {
                const newUser = await User.create({
                    telegram_id: telegramId,
                    username: username,
                    first_name: firstname,
                    last_name: lastname,
                    referral_code: newReferralCode,
                    referred_by: null
                });

                // Check-in işlemi
                await handleDailyCheckin(newUser.id);
                const dailyCheckinCount = await DailyCheckin.findOne({ where: { user_id: newUser.id } });

                return res.status(200).json({ id: newUser.id, username: newUser.username, token: newUser.token, ticket: newUser.ticket, ref_earning: newUser.ref_earning, refCount: 0, DailyCheckinCount: 1 });
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();

        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
const createGameLog = async (req, res) => {
    try {
        const { game_time, game_score, game_bomb_clicked, game_slice_numbers, hourglass_clicks, user_id } = req.body;

        // Verilen bilgileri kullanarak yeni bir oyun kaydı oluştur
        const newGame = await Game.create({
            game_time,
            game_score,
            game_bomb_clicked,
            game_slice_numbers,
            hourglass_clicks,
            user_id
        });

        // Başarılı olursa, oluşturulan oyun kaydını geri döndür
        res.status(201).json(newGame);
    } catch (error) {
        // Konsol hatası için error'u log'la
        console.error(error);

        // Hata durumunda, hata mesajını geri döndür
        res.status(500).json({ error: 'An error occurred while creating the game log.' });
    }
};
const increaseTicket = async (req, res) => {
    try {
        const { userId } = req.body;

        // Kullanıcıyı bul ve ticket sayısını bir azalt
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.ticket <= 0) {
            return res.status(400).json({ error: 'No tickets left to decrease' });
        }

        user.ticket -= 1;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the ticket count' });
    }
};
const getReferrals = async (req, res) => {
    const { userId } = req.query;
    try {
        const level1Refs = await User.findAll({ where: { referred_by: userId } });
        const user = await User.findByPk(userId);
        // Alt referansların sayısını almak için kullanıcıların bir listesini oluşturalım
        const referralsWithCount = await Promise.all(level1Refs.map(async (ref) => {
            const subRefCount = await User.count({ where: { referred_by: ref.id } });
            return {
                ...ref.toJSON(),
                subRefCount
            };
        }));

        return res.status(200).json({
            level1Referrals: referralsWithCount,
            refCount: level1Refs.length,
            myReferralCode: user.referral_code
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
const getUserId = async (req, res) => {
    const { telegramId } = req.query;
    try {
        const user = await User.findOne({ where: { telegram_id: telegramId } });

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ messagea: err.message });
    }
}
const claim = async (req, res) => {
    try {
        const { userId } = req.body;

        // Kullanıcıyı bul
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const now = new Date();
        const lastClaimDate = user.ref_earning_claim_date;

        if (lastClaimDate && (now - lastClaimDate) < 12 * 60 * 60 * 1000) {
            return res.status(400).json({ error: 'You can only claim every 12 hours' });
        }

        // ref_earning miktarını token alanına ekle ve ref_earning'i sıfırla
        user.token += user.ref_earning;
        user.ref_earning = 0;
        user.ref_earning_claim_date = now;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while claiming the referral earnings' });
    }
};
const startFarming = async (req, res) => {
    try {
        const { telegramId } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ where: { telegram_id: telegramId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Yeni bir farming kaydı oluştur
        const newFarming = await Farming.create({
            user_id: user.id,
            start_time: new Date(),
            end_time: null,
            is_active: true
        });

        res.status(201).json(newFarming);
    } catch (error) {
        // Konsol hatası için error'u log'la
        console.error(error);

        // Hata durumunda, hata mesajını geri döndür
        res.status(500).json({ error: 'An error occurred while starting the farming process' });
    }
};
const claimFarming = async (req, res) => {
    try {
        const { telegramId } = req.body;
        const farmingTokens = 43.2;

        const user = await User.findOne({ where: { telegram_id: telegramId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Aktif farming kaydını bul
        const farming = await Farming.findOne({
            where: {
                user_id: user.id,
                is_active: true
            }
        });

        if (!farming) {
            return res.status(400).json({ error: 'No active farming process found' });
        }

        const now = new Date();
        const startTime = farming.start_time;

        if ((now - startTime) < 12 * 60 * 60 * 1000) {
            return res.status(400).json({ error: 'You can only claim after 12 hours of farming' });
        }

        // Farming işlemini tamamla ve kullanıcıya token ekle
        user.token += farmingTokens; // farmingTokens değişkeni ile kazanılacak token miktarını belirleyin
        await user.save();

        farming.end_time = now;
        farming.is_active = false;
        await farming.save();

        res.status(200).json({ message: 'Farming claimed successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while claiming the farming process' });
    }
};
const farmingStatus = async (req, res) => {
    try {
        const { telegramId } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ where: { telegram_id: telegramId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Aktif farming kaydını bul
        const farming = await Farming.findOne({
            where: {
                user_id: user.id,
                is_active: true
            }
        });

        if (!farming) {
            return res.status(200).json({ isFarming: false, message: 'No active farming process found' });
        }

        // Farming durumunu ve başlangıç zamanını döndür
        return res.status(200).json({ isFarming: true, startTime: farming.start_time });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while checking the farming status' });
    }
};
const addToken = async (req, res) => {
    const { userId, score } = req.body;

    try {
        // Kullanıcıyı veritabanında bul
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kullanıcının token miktarını güncelle
        user.token += score;

        // Değişiklikleri veritabanına kaydet
        await user.save();

        return res.status(200).json({ message: 'Tokens added successfully', tokens: user.tokens });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding tokens', error: error.message });
    }
};

module.exports = { login, getTasks, createGameLog, increaseTicket, claim, startFarming, claimFarming, getReferrals, getUserId, addToken, farmingStatus };
