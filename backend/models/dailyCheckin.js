const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const DailyCheckin = sequelize.define('DailyCheckin', {
    user_id: {
        type: Sequelize.INTEGER,
    },
    checkin_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    checkin_series: {
        type: Sequelize.INTEGER,
    }
}, {
    timestamps: true
});

module.exports = DailyCheckin;

