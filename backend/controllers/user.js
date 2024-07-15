const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Referral = require('../models/referral');
const crypto = require('crypto');
const Task = require('../models/task');
const DailyCheckin = require('../models/dailyCheckin');


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
            return res.status(200).json({ username: user.username, token: user.token, ticket: user.ticket, ref_earning: user.ref_earning, refCount: refCount, DailyCheckinCount: dailyCheckinCount.checkin_series });
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

                return res.status(200).json({ username: newUser.username, token: newUser.token, ticket: newUser.ticket, ref_earning: newUser.ref_earning, refCount: 0, DailyCheckinCount: 1 });
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

                return res.status(200).json({ username: newUser.username, token: newUser.token, ticket: newUser.ticket, ref_earning: newUser.ref_earning, refCount: 0, DailyCheckinCount: 1 });
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();

        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
module.exports = { login, getTasks };
