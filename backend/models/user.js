const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    telegram_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    referral_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    referred_by: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    token: {
        type: Sequelize.FLOAT,
        defaultValue: 0
    },
    ref_earning: {
        type: Sequelize.FLOAT,
        defaultValue: 0
    },
    ticket: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    ref_earning_claim_date: {
        type: Sequelize.DATE
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;