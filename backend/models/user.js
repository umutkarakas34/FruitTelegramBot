const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const User = sequelize.define('User', {
    telegramId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    username: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    token: Sequelize.DOUBLE,
})

module.exports = User;