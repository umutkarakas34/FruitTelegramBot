const Sequelize = require('sequelize');
const sequelize = require('../utility/db');
const Admin = require('./admin'); // Admin modelini içe aktarma

const Task = sequelize.define('Task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    task_title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    task_image: {
        type: Sequelize.STRING,
        allowNull: true
    },
    task_description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Admin,
            key: 'id'
        }
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'tasks',
    timestamps: false
});


module.exports = Task;
