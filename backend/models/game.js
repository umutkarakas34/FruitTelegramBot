const Sequelize = require('sequelize');
const sequelize = require('../utility/db');
const User = require('./user'); // User modelini içe aktarma

const Game = sequelize.define('Game', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    game_time: {
        type: Sequelize.FLOAT, // Oynanan toplam süre saniye cinsinden
        allowNull: false
    },
    game_score: {
        type: Sequelize.INTEGER, // Oyun sonu skoru
        allowNull: false
    },
    game_bomb_clicked: {
        type: Sequelize.INTEGER, // Bombaya kaç kere tıklanmış
        allowNull: false
    },
    game_slice_numbers: {
        type: Sequelize.INTEGER, // Kesişen meyve sayısı
        allowNull: false
    },
    hourglass_clicks: {
        type: Sequelize.INTEGER, // Kum saatine kaç kere tıklanmış
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'games',
    timestamps: false
});

module.exports = Game;
