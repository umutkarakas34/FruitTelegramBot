const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const Referral = sequelize.define('Referral', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Kullanıcı tablosu ismi
            key: 'id'
        }
    },
    referred_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Kullanıcı tablosu ismi
            key: 'id'
        }
    },
    referral_level: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'referrals',
    timestamps: false
});

module.exports = Referral;