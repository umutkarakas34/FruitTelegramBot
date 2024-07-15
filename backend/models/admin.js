const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const Admin = sequelize.define('Admin', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'admins',
    timestamps: false
});

module.exports = Admin;
