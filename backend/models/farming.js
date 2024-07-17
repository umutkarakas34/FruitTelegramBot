const Sequelize = require('sequelize');
const sequelize = require('../utility/db');
const User = require('./user'); // User modelini içe aktarma

const Farming = sequelize.define('Farming', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    start_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    end_time: {
        type: Sequelize.DATE,
        allowNull: true
    },
    is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'farmings',
    timestamps: false
});

module.exports = Farming;
