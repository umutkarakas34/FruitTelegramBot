const { Sequelize } = require('sequelize');

// Sequelize örneğini oluştur
const sequelize = new Sequelize('fruitgame', 'root', 'm22900534M', {
    host: 'localhost',
    dialect: 'mysql',
    logging: true
});

module.exports = sequelize;
