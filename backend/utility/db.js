const { Sequelize } = require('sequelize');

// Sequelize örneğini oluştur
const sequelize = new Sequelize('fruitgame', 'root', 'lPJYja3W1GiT2IPY', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log
});

module.exports = sequelize;
