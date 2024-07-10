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
        type: Sequelize.STRING,
        allowNull: true
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